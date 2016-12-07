const Schema = require('mongoose').Schema

const geocodingPlugin = require('./plugins/geocode')
const trashPlugin = require('./plugins/trash')

const schema = new Schema({
  address: String,
  groupId: {
    ref: 'Group',
    required: true,
    type: Schema.Types.ObjectId
  },
  location: {
    lat: Number,
    lon: Number
  },
  name: {
    required: true,
    type: String
  }
})

schema.plugin(geocodingPlugin)
schema.plugin(trashPlugin)

module.exports = schema
