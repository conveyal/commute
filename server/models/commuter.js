const {Schema} = require('mongoose')

module.exports = new Schema({
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
