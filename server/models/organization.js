const {Schema} = require('mongoose')

const db = require('../db')
const Analysis = db.model('Analysis', require('./analysis'))
const Group = db.model('Group', require('./group'))
const trashPlugin = require('./plugins/trash')
const Site = db.model('Site', require('./site'))
const dbUtils = require('../utils/db')

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

schema.plugin(trashPlugin)

schema.pre('save', dbUtils.makeCascadeDeleteModelsFn('organizationId', [Analysis, Group, Site]))

module.exports = schema
