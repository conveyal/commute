const {Schema} = require('mongoose')

module.exports = new Schema({
  name: String,
  owner: String,
  groups: [{
    ref: 'Group',
    type: Schema.Types.ObjectId
  }]
})
