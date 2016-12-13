const Schema = require('mongoose').Schema

const geocoder = require('isomorphic-mapzen-search')

const settings = require('../../utils/env').settings
const later = require('../../utils/later')
const timedQueue = require('../../utils/timedQueue')

const geocodeRequestQueue = timedQueue([{
  timePeriodLength: 1100,
  maxRequestsPerTimePeriod: 4  // max queries allowed should be 6, but limit to 4 to be safe
} /* , {
  // it's not documented but I was seeing error messages that say:
  // 6 max request per minute
  // I tried halving the amount and eventually it seems like this wasn't needed
  timePeriodLength: 3700,
  maxRequestsPerTimePeriod: 6
} */])

const maxRetries = 5

const geocodeSearchOptions = {
  circle: {
    latlng: settings.geocoder.focus,
    radius: settings.geocoder.focus.radius
  }
}

module.exports = function (schema, options) {
  /**
   * Add address and coordinate fields
   */
  schema.add({
    address: String,
    city: String,
    coordinate: {
      type: Schema.Types.Mixed,
      default: {
        lng: 0,
        lat: 0
      }
    },
    country: String,
    county: String,
    geocodeConfidence: {
      default: -1,
      type: Number
    },
    neighborhood: String,
    original_address: String,
    state: String
  })

  /**
   * Geocode address on change
   */
  schema.pre('save', true, function (next, done) {
    next()

    // Save the original address
    if (this.isNew) {
      this.original_address = this.address
      if (!this.address && this.validCoordinate()) {
        var self = this
        this.reverseGeocode(function (err) {
          if (err) {
            self.original_address = self.address = self.coordinate.lng.toFixed(4) + ', ' + self.coordinate.lat.toFixed(4)
            self.neighborhood = ''
            self.city = ''
            self.county = ''
            self.state = ''
            self.country = ''
            self.geocodeConfidence = 0
          }
        })
      } else if (this.address && !this.validCoordinate()) {
        this.geocode()
      }
      // otherwise assume geocode happened elsewhere and do no operation
    } else {
      if (this.isModified('coordinate')) {
        this.reverseGeocode()
      } else if (this.addressChanged()) {
        this.geocode()
      }
    }
    done()
  })

  /**
   * Address changed
   */
  schema.methods.addressChanged = function () {
    return this.isModified('address') || this.isModified('city') || this.isModified(
      'state') || this.isModified('country')
  }

  /**
   * Geocode
   */
  schema.methods.geocode = function () {
    if (!this.fullAddress() || this.fullAddress().length < 3) {
      return
    }

    let numTries = 0
    const doGeocodeUntilSuccess = () => {
      numTries++
      const addressToGeocode = this.fullAddress()
      geocodeRequestQueue.push(() => {
        console.log(`try geocode for ${addressToGeocode}`)
        geocoder.search(process.env.MAPZEN_SEARCH_KEY, this.fullAddress(), geocodeSearchOptions)
          .then((geojson) => {
            if (!geojson.features) throw geojson
            console.log(`successful geocode for ${addressToGeocode}`)
            const firstResult = geojson.features[0]
            this.address = firstResult.properties.label
            this.city = firstResult.properties.locality
            this.confidence = firstResult.properties.confidence
            this.coordinate = {
              lat: firstResult.geometry.coordinates[1],
              lng: firstResult.geometry.coordinates[0]
            }
            this.country = firstResult.properties.country
            this.county = firstResult.properties.county
            this.geocodeConfidence = firstResult.properties.confidence
            this.neighborhood = firstResult.properties.neighborhood
            this.state = firstResult.properties.region
            this.save()
          })
          .catch((err) => {
            console.error(err)
            if (numTries < maxRetries) {
              doGeocodeUntilSuccess()
            } else {
              console.error(`Geocoding failed for ${addressToGeocode} after 5 tries!`)
            }
          })
      })
    }

    later(doGeocodeUntilSuccess)
  }

  /**
   * Reverse Geocode
   */

  schema.methods.reverseGeocode = function () {
    var self = this
    later(() => {
      geocodeRequestQueue.push(() => {
        geocoder.reverse(this.coordinate, function (err, address) {
          if (err) {
            console.error(err)
          } else {
            self.address = address.address
            self.neighborhood = address.neighborhood
            self.city = address.city
            self.county = address.county
            self.state = address.state
            self.country = address.country

            self.save()
          }
        })
      })
    })
  }

  /**
   * Add geospatial index to coordinate
   */

  schema.index({
    coordinate: '2d'
  })

  /**
   * Valid coordinates
   */

  schema.methods.validCoordinate = function () {
    var c = this.coordinate
    return c && c.lat && c.lng
  }

  /**
   * Full address
   */

  schema.methods.fullAddress = function () {
    return [this.address, this.city, this.state].filter(function (v) {
      return !!v
    }).join(', ')
  }
}
