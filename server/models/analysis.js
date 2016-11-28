const {Schema} = require('mongoose')

module.exports = new Schema({
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
  trips: Array
})
