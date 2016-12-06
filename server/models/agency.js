const {Schema} = require('mongoose')

const Organization = require('./organization')
const trashPlugin = require('./plugins/trash')

const schema = new Schema({
  name: {
    required: true,
    type: String
  }
})

schema.pre('save', function (next) {
  // CASCADE DELETE if needed
  if (this.isModified('trashed') && this.trashed) {
    Organization.update({ agencyId: this._id }, { trashed: new Date() }).exec()
  }
  next()
})

schema.plugin(trashPlugin)

module.exports = schema
