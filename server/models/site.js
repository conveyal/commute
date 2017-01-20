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

schema.plugin(geocodingPlugin)
schema.plugin(trashPlugin)

schema.pre('save', true, function (next, done) {
  next()

  // import here to resolve circular import
  const isochroneUtils = require('../utils/isochrones')

  if (this.isModified('coordinates') || this.isNew) {
    const self = this

    // detected change in location, initiate polygon calculation
    later(() => {
      isochroneUtils.calculateSiteIsochrones(self)
    })
  }

  done()
})

module.exports = schema
