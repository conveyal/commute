const Schema = require('mongoose').Schema

const userPlugin = require('./plugins/user')

const schema = new Schema({
  geometry: {
    required: true,
    type: Schema.Types.Mixed
  },
  mode: {
    required: true,
    type: String
  },
  properties: {
    required: true,
    type: Schema.Types.Mixed
  },
  siteId: {
    required: true,
    type: Schema.Types.ObjectId
  }
})

schema.plugin(userPlugin)

module.exports = schema
