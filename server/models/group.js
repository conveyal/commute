const {Schema} = require('mongoose')

module.exports = new Schema({
  name: String,
  organization: {
    ref: 'Organization',
    type: Schema.Types.ObjectId
  },
  commuters: [{
    ref: 'Commuter',
    type: Schema.Types.ObjectId
  }]
})
