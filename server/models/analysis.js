const {Schema} = require('mongoose')

module.exports = new Schema({
  group: {
    ref: 'Group',
    required: true,
    type: Schema.Types.ObjectId
  },
  name: {
    required: true,
    type: String
  },
  organization: {
    ref: 'Organization',
    required: true,
    type: Schema.Types.ObjectId
  },
  site: {
    ref: 'Site',
    required: true,
    type: Schema.Types.ObjectId
  },
  trips: Array
})
