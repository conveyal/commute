const {Schema} = require('mongoose')

module.exports = new Schema({
  address: String,
  location: {
    lat: Number,
    lon: Number
  },
  name: String,
  organization: {
    ref: 'Organization',
    type: Schema.Types.ObjectId
  }
})
