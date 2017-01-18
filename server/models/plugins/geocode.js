const Schema = require('mongoose').Schema

const queue = require('async/queue')
const geocoder = require('isomorphic-mapzen-search')

const settings = require('../../utils/env').settings
const later = require('../../utils/later')

function now () {
  return (new Date()).getTime()
}

let lastRequestTime = 0
const geocodeRequestQueue = queue((task, callback) => {
  setTimeout(() => {
    console.log('do a new reqeust')
    lastRequestTime = now()
    task(callback)
  }, Math.max(0, 600 - (now() - lastRequestTime))) // wait at least 0.5 second between requests
})

const maxRetries = 10

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
        lon: 0,
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
    originalAddress: String,
    positionLastUpdated: Date,
    state: String
  })

  /**
   * Geocode address on change
   */
  schema.pre('save', true, function (next, done) {
    next()

    // Save the original address
    if (this.isNew) {
      if (!this.address && this.validCoordinate()) {
        // coordinates provided, but address is blank
        // perform reverse geocode
        var self = this
        this.reverseGeocode(function (err) {
          if (err) {
            self.original_address = self.address = self.coordinate.lon.toFixed(4) + ', ' + self.coordinate.lat.toFixed(4)
            self.neighborhood = ''
            self.city = ''
            self.county = ''
            self.state = ''
            self.country = ''
            self.geocodeConfidence = 0
            self.positionLastUpdated = new Date()
          }
        })
      } else if (this.address && !this.validCoordinate()) {
        // address provided, but coordinates are blank
        // perform geocode
        this.original_address = this.address
        this.geocode()
      } else {
        // address and coordinates provided
        // assume geocode happened elsewhere and only update positionLastUpdated
        this.positionLastUpdated = new Date()
      }
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

    const addressToGeocode = this.fullAddress()

    later(() => {
      geocodeRequestQueue.push((queueCallback) => {
        let numTries = 0
        const doGeocodeUntilSuccess = () => {
          numTries++
          console.log(`try geocode for ${addressToGeocode}`)
          geocoder.search(process.env.MAPZEN_SEARCH_KEY, this.fullAddress(), geocodeSearchOptions)
            .then((geojson) => {
              if (!geojson.features) throw geojson
              console.log(`successful geocode for ${addressToGeocode}`)
              const firstResult = geojson.features[0]
              this.address = firstResult.properties.label
              this.city = firstResult.properties.locality
              this.coordinate = {
                lat: firstResult.geometry.coordinates[1],
                lon: firstResult.geometry.coordinates[0]
              }
              this.country = firstResult.properties.country
              this.county = firstResult.properties.county
              this.geocodeConfidence = firstResult.properties.confidence
              this.neighborhood = firstResult.properties.neighborhood
              this.state = firstResult.properties.region
              this.positionLastUpdated = new Date()
              this.save()
              queueCallback()
            })
            .catch((err) => {
              console.error(err)
              if (numTries < maxRetries) {
                const secondsToWait = Math.pow(2, numTries)
                console.log(`wait ${secondsToWait} seconds before retrying ${addressToGeocode}`)
                setTimeout(doGeocodeUntilSuccess, secondsToWait * 1000)
              } else {
                console.error(`Geocoding failed for ${addressToGeocode} after 5 tries!`)
                queueCallback(err)
              }
            })
        }
        doGeocodeUntilSuccess()
      })
    })
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
            self.positionLastUpdated = new Date()
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
    return c && c.lat && c.lon
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
