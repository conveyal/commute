const Schema = require('mongoose').Schema

const {bulk} = require('@conveyal/geocoder-arcgis-geojson')
const {asyncify, cargo} = require('async')

const env = require('../../utils/env')
const later = require('../../utils/later')

const GEOCODE_BATCH_SIZE = 150
const bulkGeocodeRequestQueue = cargo(
  asyncify(addresses => {
    console.log('geocoding ' + addresses.length + ' addresses in bulk')
    return bulk({
      addresses,
      boundary: env.settings.geocoder.boundary,
      clientId: env.env.ARCGIS_CLIENT_ID,
      clientSecret: env.env.ARCGIS_CLIENT_SECRECT
    })
      .then(results => {
        const resultsByObjectId = {}
        results.features.forEach(feature => {
          resultsByObjectId[feature.properties.resultId] = feature
        })
        return resultsByObjectId
      })
  }),
  GEOCODE_BATCH_SIZE
)

let UNIQUE_ID = 0

/**
 * Helper to get unique integer ids because arcgis can't handle unique strings
 */
function getUniqueId () {
  return UNIQUE_ID++
}

/**
 * Geocode an address and invoke the callback upon
 * completion of the bulk geocode request
 *
 * @param  {Object}   address  An object with the `address` and `OBJECTID` keys`
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function geocodeAddress (address, callback) {
  bulkGeocodeRequestQueue.push(address, (err, results) => {
    if (err) return callback(err)
    callback(null, results[address.OBJECTID])
  })
}

module.exports = function (postGeocodeHook) {
  if (!postGeocodeHook) {
    postGeocodeHook = () => null
  }
  return function (schema, options) {
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
          this.reverseGeocode()
        } else if (this.address && !this.validCoordinate()) {
          // address provided, but coordinates are blank
          // perform geocode
          this.originalAddress = this.address
          this.geocode()
        } else {
          // address and coordinates provided
          this.positionLastUpdated = new Date()
          postGeocodeHook(this)  // initiate since it's the first time
        }
      } else {
        const addressChanged = this.addressChanged()
        const coordinateModified = this.isModified('coordinate')
        if (!addressChanged && coordinateModified) {
          this.reverseGeocode()
        } else if (addressChanged && !coordinateModified) {
          this.geocode()
        } else if (addressChanged && coordinateModified) {
          // address and coordinates provided
          // geocode information has been provided
          this.positionLastUpdated = new Date()
          postGeocodeHook(this)
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
      const addressToGeocode = this.fullAddress()

      if (!addressToGeocode || addressToGeocode.length < 3) {
        return
      }

      this.geocodeLater(addressToGeocode)
    }

    /**
     * Reverse Geocode
     */

    schema.methods.reverseGeocode = function () {
      this.geocodeLater(this.coordinate)
    }

    schema.methods.geocodeLater = function (addressQuery) {
      later(() => {
        geocodeAddress(
          {
            address: addressQuery,
            OBJECTID: getUniqueId()  // ESRI needs to have an int for this.  String is no good
          },
          (err, feature) => {
            if (err) {
              console.error(err)
              throw err
            }
            this.address = feature.properties.label
            this.city = feature.properties.locality
            this.coordinate = {
              lat: feature.geometry.coordinates[1],
              lon: feature.geometry.coordinates[0]
            }
            this.country = feature.properties.country
            this.county = feature.properties.county
            this.geocodeConfidence = feature.properties.confidence
            this.neighborhood = feature.properties.neighborhood
            this.state = feature.properties.region
            this.positionLastUpdated = new Date()
            // save geocode info
            // this will trigger this save hook again with address and coord changes
            this.save()
          }
        )
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

    schema.methods.mapzenSafeDCAddress = function () {
      return this.fullAddress().replace(/,\s*dc/i, '')
    }
  }
}
