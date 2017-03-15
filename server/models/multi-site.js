const Schema = require('mongoose').Schema

const trashPlugin = require('./plugins/trash')
const userPlugin = require('./plugins/user')

const schema = new Schema({
  name: {
    required: true,
    type: String
  },
  sites: [Schema.Types.ObjectId]
})

schema.plugin(trashPlugin)
schema.plugin(userPlugin)

module.exports = schema
