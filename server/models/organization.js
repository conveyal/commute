const {Schema} = require('mongoose')

const Analysis = require('./analysis')
const Group = require('./group')
const Site = require('./site')

const organizationSchema = new Schema({
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

organizationSchema.pre('remove', function (next) {
  // CASCADE DELETE
  Analysis.remove({ organizationId: this._id }).exec()
  Group.remove({ organizationId: this._id }).exec()
  Site.remove({ organizationId: this._id }).exec()
  next()
})

module.exports = organizationSchema
