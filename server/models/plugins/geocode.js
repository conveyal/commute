const Schema = require('mongoose').Schema

const geocoder = require('isomorphic-mapzen-search')

const requestStack = []  // TODO: implement as queue so it does FIFO
const numRequestsPerConstraint = [0]
const timePeriodConstraints = [{
  timePeriodLength: 1100,
  maxRequestsPerTimePeriod: 5  // max queries allowed should be 6, but limit to 5 to be safe
}]

function processRequests () {
  // determine if it is possible to run
  while (requestStack.length > 0 &&
    timePeriodConstraints.every((constraint, idx) => {
      return numRequestsPerConstraint[idx] < constraint.maxRequestsPerTimePeriod
    })) {
    // possible to make a request, initiate one request
    const newRequest = requestStack.pop()
    newRequest()

    // set timeouts to decrement timePeriod constraints
    timePeriodConstraints.forEach((constraint, idx) => {
      numRequestsPerConstraint[idx]++
      setTimeout(() => {
        numRequestsPerConstraint[idx]--
        processRequests()
      }, constraint.timePeriodLength)
    })
  }
}

/**
 * Enque a geocode request to limit requests per second
 *
 * @param  {function} request A function that performs the geocode request.
 */
function enqueRequest (request) {
  requestStack.push(request)
  processRequests()
}

module.exports = function (schema, options) {
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

    enqueRequest(() => {
      geocoder.search(process.env.MAPZEN_SEARCH_KEY, this.fullAddress())
        .then((geojson) => {
          if (!geojson.features) return callback(geojson)
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
    })
  }

  /**
   * Reverse Geocode
   */

  schema.methods.reverseGeocode = function (callback) {
    var self = this
    enqueRequest(() => {
      geocoder.reverse(this.coordinate, function (err, address) {
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
