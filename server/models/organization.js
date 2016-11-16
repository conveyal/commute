const {Schema} = require('mongoose')

module.exports = new Schema({
  analyses: [{
    ref: 'Analysis',
    type: Schema.Types.ObjectId
  }],
  groups: [{
    ref: 'Group',
    type: Schema.Types.ObjectId
  }],
  name: {
    required: true,
    type: String
  },
  owner: String,
  sites: [{
    ref: 'Site',
    type: Schema.Types.ObjectId
  }]
})
