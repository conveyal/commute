const {Schema} = require('mongoose')

const Commuter = require('./commuter')

const groupSchema = new Schema({
  name: {
    required: true,
    type: String
  },
  organizationId: {
    ref: 'Organization',
    required: true,
    type: Schema.Types.ObjectId
  }
})

groupSchema.pre('remove', function (next) {
  // CASCADE DELETE
  Commuter.remove({ groupId: this._id }).exec()
  next()
})

module.exports = groupSchema
