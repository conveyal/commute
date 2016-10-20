const {Schema} = require('mongoose')

module.exports = new Schema({
  location: Object, // GeoJSON Point
  name: String,
  organization: {
    ref: 'Organization',
    type: Schema.Types.ObjectId
  }
})
