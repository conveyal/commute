const {Schema} = require('mongoose')

const Analysis = require('./analysis')
const Group = require('./group')
const trashPlugin = require('./plugins/trash')
const Site = require('./site')

const schema = new Schema({
  agencyId: {
    ref: 'Agency',
    required: true,
    type: Schema.Types.ObjectId
  },
  name: {
    required: true,
    type: String
  },
  owner: String
})

schema.pre('save', function (next) {
  // CASCADE DELETE if needed
  if (this.isModified('trashed') && this.trashed) {
    Analysis.update({ organizationId: this._id }, { trashed: new Date() }).exec()
    Group.update({ organizationId: this._id }, { trashed: new Date() }).exec()
    Site.update({ organizationId: this._id }, { trashed: new Date() }).exec()
  }
  next()
})

schema.plugin(trashPlugin)

module.exports = schema
