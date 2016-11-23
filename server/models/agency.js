const {Schema} = require('mongoose')

module.exports = new Schema({
  name: {
    required: true,
    type: String
  },
  organizations: [{
    ref: 'Organization',
    type: Schema.Types.ObjectId
  }]
})
