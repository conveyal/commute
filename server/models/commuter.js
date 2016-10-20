const {Schema} = require('mongoose')

module.exports = new Schema({
  location: Object, // GeoJSON Point
  name: String
})
