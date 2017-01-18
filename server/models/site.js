const Schema = require('mongoose').Schema

const geocodingPlugin = require('./plugins/geocode')
const trashPlugin = require('./plugins/trash')

const modeTravelTimeTable = [{
  timeRange: String,
  numCommuters: Number
}]

const schema = new Schema({
  travelTimeIsochrones: Schema.Types.Mixed,
  modeSummaries: {
    bicycle: modeTravelTimeTable,
    car: modeTravelTimeTable,
    transit: modeTravelTimeTable,
    walk: modeTravelTimeTable,
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

module.exports = schema
