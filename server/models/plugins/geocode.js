import {Schema} from 'mongoose'

import {reverse, search} from 'isomorphic-mapzen-search'

export default function (schema, options) {
  /**
   * Add address and coordinate fields
   */
  schema.add({
    address: String,
    neighborhood: String,
    city: String,
    county: String,
    state: String,
    country: String,
    coordinate: {
      type: Schema.Types.Mixed,
      default: {
        lng: 0,
        lat: 0
      }
    },
    original_address: String
  })

  /**
   * Geocode address on change
   */
  schema.pre('save', true, function (next, done) {
    next()

    // Save the original address
    if (this.isNew) {
      this.original_address = this.address
      if (this.validCoordinate()) {
        var self = this
        this.reverseGeocode(function (err) {
          if (err) {
            self.original_address = self.address = self.coordinate.lng.toFixed(4) + ', ' + self.coordinate.lat.toFixed(4)
            self.neighborhood = ''
            self.city = ''
            self.county = ''
            self.state = ''
            self.country = ''
          }
          done()
        })
      } else {
        this.geocode(done)
      }
    } else {
      if (this.isModified('coordinate')) {
        this.reverseGeocode(done)
      } else if (this.addressChanged()) {
        this.geocode(done)
      } else {
        done()
      }
    }
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
  schema.methods.geocode = function (callback) {
    if (!this.fullAddress() || this.fullAddress().length < 3) {
      return callback()
    }

    search(process.env.MAPZEN_SEARCH_KEY, this.fullAddress())
      .then((geojson) => {
        const firstResult = geojson.features[0]
        this.address = firstResult.properties.label
        this.neighborhood = firstResult.properties.neighborhood
        this.city = firstResult.properties.locality
        this.county = firstResult.properties.county
        this.state = firstResult.properties.region
        this.country = firstResult.properties.country
        this.coordinate = {
          lat: firstResult.geometry.coordinates[1],
          lng: firstResult.geometry.coordinates[0]
        }
        callback()
      })
      .catch(callback)
  }

  /**
   * Reverse Geocode
   */

  schema.methods.reverseGeocode = function (callback) {
    var self = this
    reverse(this.coordinate, function (err, address) {
      if (err) {
        callback(err)
      } else {
        self.address = address.address
        self.neighborhood = address.neighborhood
        self.city = address.city
        self.county = address.county
        self.state = address.state
        self.country = address.country

        callback(null, address)
      }
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
