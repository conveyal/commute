const Schema = require('mongoose').Schema

const trashPlugin = require('./plugins/trash')

const schema = new Schema({
  name: {
    required: true,
    type: String
  },
  analysisId: {
    ref: 'Analysis',
    required: true,
    type: Schema.Types.ObjectId
  }
})

schema.plugin(trashPlugin)

module.exports = schema
