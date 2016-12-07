const {Schema} = require('mongoose')

const trashPlugin = require('./plugins/trash')

const schema = new Schema({
  groupId: {
    ref: 'Group',
    required: true,
    type: Schema.Types.ObjectId
  },
  name: {
    required: true,
    type: String
  },
  organizationId: {
    ref: 'Organization',
    required: true,
    type: Schema.Types.ObjectId
  },
  siteId: {
    ref: 'Site',
    required: true,
    type: Schema.Types.ObjectId
  },
  summary: {
    // fields
    avgTravelTime: Number,
    avgDistance: Number,
    savingsPerTrip: Number,
    savingsPerTripYear: Number,
    savingsTotalPerDay: Number,
    savingsTotalPerYear: Number,

    // mongoose
    default: {
      avgTravelTime: 0,
      avgDistance: 0,
      savingsPerTrip: 0,
      savingsPerTripYear: 0,
      savingsTotalPerDay: 0,
      savingsTotalPerYear: 0
    },
    required: true,
    type: Schema.Types.Mixed
  },
  trips: Array
})

schema.plugin(trashPlugin)

module.exports = schema
