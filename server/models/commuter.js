const Schema = require('mongoose').Schema

const geocodingPlugin = require('./plugins/geocode')
const trashPlugin = require('./plugins/trash')

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

schema.plugin(geocodingPlugin)
schema.plugin(trashPlugin)

schema.pre('save', true, function (next, done) {
  next()

  if (this.isModified('coordinates') || this.isNew) {
    // detected change in location, initiate polygon calculation
    const self = this

    // import here to resolve circular import
    const models = require('./')
    const isochroneUtils = require('../utils/isochrones')

    models.Site.findOne({ _id: this.siteId, trashed: undefined })
      .exec()
      .then((site) => {
        const siteIsochrones = site.travelTimeIsochrones

        isochroneUtils.calculateIsochroneStatsForCommuter(self, siteIsochrones)

        done()
      })
      .catch((err) => {
        console.error('error calculating commuter stats:', err)
        done()
      })
  } else {
    done()
  }
})

module.exports = schema
