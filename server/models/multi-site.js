const Schema = require('mongoose').Schema

const trashPlugin = require('./plugins/trash')

const modeTravelTimeTable = [{
  timeRange: String,
  numCommuters: Number
}]

const schema = new Schema({
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
  }],
  Sites: [Schema.Types.ObjectId]
})

schema.plugin(trashPlugin)

module.exports = schema
