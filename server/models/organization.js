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
  name: String,
  owner: String,
  sites: [{
    ref: 'Site',
    type: Schema.Types.ObjectId
  }]
})
