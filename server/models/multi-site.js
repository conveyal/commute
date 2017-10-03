const Schema = require('mongoose').Schema

const reportConfig = require('./report-config')
const trashPlugin = require('./plugins/trash')
const userPlugin = require('./plugins/user')

const schema = new Schema({
  name: {
    required: true,
    type: String
  },
  reportConfig: reportConfig,
  sites: [Schema.Types.ObjectId]
})

schema.plugin(trashPlugin)
schema.plugin(userPlugin)

module.exports = schema
