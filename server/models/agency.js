const {Schema} = require('mongoose')

const db = require('../db')
const Organization = db.model('Organization', require('./organization'))
const trashPlugin = require('./plugins/trash')
const dbUtils = require('../utils/db')

const schema = new Schema({
  name: {
    required: true,
    type: String
  }
})

schema.plugin(trashPlugin)

schema.pre('save', dbUtils.makeCascadeDeleteModelsFn('agencyId', [Organization]))

module.exports = schema
