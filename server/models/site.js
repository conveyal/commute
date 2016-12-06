const Schema = require('mongoose').Schema

const geocodingPlugin = require('./plugins/geocode')
const trashPlugin = require('./plugins/trash')

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
schema.plugin(trashPlugin)

module.exports = schema
