const Schema = require('mongoose').Schema

const geocodingPlugin = require('./plugins/geocode')

const schema = new Schema({
  address: String,
  location: {
    lat: Number,
    lon: Number
  },
  name: {
    required: true,
    type: String
  },
  organizationId: {
    ref: 'Organization',
    required: true,
    type: Schema.Types.ObjectId
  }
})

schema.plugin(geocodingPlugin)

module.exports = schema
