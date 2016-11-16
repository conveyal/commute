const {Schema} = require('mongoose')

module.exports = new Schema({
  commuters: [{
    ref: 'Commuter',
    type: Schema.Types.ObjectId
  }],
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
