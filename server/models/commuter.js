const {Schema} = require('mongoose')

module.exports = new Schema({
  address: String,
  group: {
    ref: 'Group',
    type: Schema.Types.ObjectId
  },
  location: {
    lat: Number,
    lon: Number
  },
  name: String
})
