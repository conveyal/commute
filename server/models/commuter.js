const Schema = require('mongoose').Schema

const geocodingPlugin = require('./plugins/geocode')

const schema = new Schema({
  address: String,
  group: {
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

module.exports = schema
