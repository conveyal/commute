const {Schema} = require('mongoose')

module.exports = new Schema({
  address: String,
  location: {
    lat: Number,
    lon: Number
  },
  name: {
    required: true,
    type: String
  },
  organization: {
    ref: 'Organization',
    required: true,
    type: Schema.Types.ObjectId
  }
})
