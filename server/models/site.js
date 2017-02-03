const Schema = require('mongoose').Schema

const geocodingPlugin = require('./plugins/geocode')
const trashPlugin = require('./plugins/trash')
const userPlugin = require('./plugins/user')
const later = require('../utils/later')

const schema = new Schema({
  calculationStatus: {
    default: 'calculating',
    type: String
  },
  name: {
    required: true,
    type: String
  },
  travelTimeIsochrones: {
    bicycle: Schema.Types.Mixed,
    car: Schema.Types.Mixed,
    transit: Schema.Types.Mixed,
    walk: Schema.Types.Mixed,
    type: Schema.Types.Mixed
  }
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
schema.plugin(userPlugin)

module.exports = schema
