const Schema = require('mongoose').Schema

const geocodingPlugin = require('./plugins/geocode')
const trashPlugin = require('./plugins/trash')
const later = require('../utils/later')

const schema = new Schema({
  travelTimeIsochrones: {
    bicycle: Schema.Types.Mixed,
    car: Schema.Types.Mixed,
    transit: Schema.Types.Mixed,
    walk: Schema.Types.Mixed,
    type: Schema.Types.Mixed
  },
  name: {
    required: true,
    type: String
  },
  rideshares: [{
    commuter1: Schema.Types.ObjectId,
    commuter2: Schema.Types.ObjectId,
    distance: Number
  }]
})

function postGeocodeHook (site) {
  // import here to resolve circular import
  const isochroneUtils = require('../utils/isochrones')

  later(() => {
    isochroneUtils.calculateSiteIsochrones(site)
  })
}

schema.plugin(geocodingPlugin(postGeocodeHook))
schema.plugin(trashPlugin)

module.exports = schema
