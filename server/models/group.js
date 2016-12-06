const {Schema} = require('mongoose')

const Commuter = require('./commuter')
const trashPlugin = require('./plugins/trash')

const schema = new Schema({
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

schema.pre('save', function (next) {
  // CASCADE DELETE if needed
  if (this.isModified('trashed') && this.trashed) {
    Commuter.update({ groupId: this._id }, { trashed: new Date() }).exec()
  }
  next()
})

schema.plugin(trashPlugin)

module.exports = schema
