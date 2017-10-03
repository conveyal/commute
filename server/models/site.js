const Schema = require('mongoose').Schema

const geocodingPlugin = require('./plugins/geocode')
const trashPlugin = require('./plugins/trash')
const userPlugin = require('./plugins/user')
const reportConfig = require('./report-config')
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
  reportConfig: reportConfig
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
