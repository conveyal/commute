const Schema = require('mongoose').Schema

const trashPlugin = require('./plugins/trash')

const schema = new Schema({
  name: {
    required: true,
    type: String
  },
  rideshares: [{
    commuter1: Schema.Types.ObjectId,
    commuter2: Schema.Types.ObjectId,
    distance: Number
  }],
  sites: [Schema.Types.ObjectId]
})

schema.plugin(trashPlugin)

module.exports = schema
