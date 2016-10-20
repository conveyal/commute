const {Schema} = require('mongoose')

module.exports = new Schema({
  group: {
    ref: 'Group',
    type: Schema.Types.ObjectId
  },
  organization: {
    ref: 'Organization',
    type: Schema.Types.ObjectId
  },
  site: {
    ref: 'Site',
    type: Schema.Types.ObjectId
  }
})
