const Schema = require('mongoose').Schema

const geocodingPlugin = require('./plugins/geocode')
const trashPlugin = require('./plugins/trash')
const userPlugin = require('./plugins/user')

const modeType = {
  travelTime: Number
}

const schema = new Schema({
  modeStats: {
    bicycle: modeType,
    car: modeType,
    transit: modeType,
    walk: modeType,
    type: Schema.Types.Mixed
  },
  name: {
    required: true,
    type: String
  },
  siteId: {
    ref: 'Site',
    required: true,
    type: Schema.Types.ObjectId
  }
})

function postGeocodeHook (commuter) {
  console.log('commuter added or location changed, initiating polygon calculation')

  // import here to resolve circular import
  const models = require('./')
  const isochroneUtils = require('../utils/isochrones')

  models.Site.findOne({ _id: commuter.siteId, trashed: undefined, user: commuter.user })
    .exec()
    .then((site) => {
      if (site.calculationStatus === 'successfully') {
        models.Polygon.find({ _id: commuter.siteId })
          .exec()
          .then((polygons) => {
            const siteIsochrones = {}
            polygons.forEach((polygon) => {
              if (!siteIsochrones[polygon.mode]) {
                siteIsochrones[polygon.mode] = {
                  features: []
                }
              }
              siteIsochrones[polygon.mode].features.push(polygon)
            })

            if (site.calculationStatus === 'successfully') {
              isochroneUtils.calculateIsochroneStatsForCommuter(commuter, siteIsochrones)

              console.log('commuter stats calculated')

              commuter.save()
            }
          })
          .catch((err) => {
            console.error('error calculating commuter stats:', err)
          })
      }
    })
    .catch((err) => {
      console.error('error calculating commuter stats:', err)
    })
}

schema.plugin(geocodingPlugin(postGeocodeHook))
schema.plugin(trashPlugin)
schema.plugin(userPlugin)

module.exports = schema
