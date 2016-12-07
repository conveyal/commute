const {Schema} = require('mongoose')

const db = require('../db')
const Commuter = db.model('Commuter', require('./commuter'))
const trashPlugin = require('./plugins/trash')
const dbUtils = require('../utils/db')

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

schema.plugin(trashPlugin)

schema.pre('save', dbUtils.makeCascadeDeleteModelsFn('groupId', [Commuter]))

module.exports = schema
