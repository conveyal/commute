const Schema = require('mongoose').Schema

const trashPlugin = require('./plugins/trash')

const modeType = {
  distance: Number,
  monetaryCost: Number,
  time: Number,
  totalCost: Number,
  polygon: String,
  possible: Boolean
}

const schema = new Schema({
  analysisId: {
    ref: 'Analysis',
    required: true,
    type: Schema.Types.ObjectId
  },
  bike: modeType,
  car: modeType,
  commuterId: {
    ref: 'Commuter',
    required: true,
    type: Schema.Types.ObjectId
  },
  mostLikely: Object.assign({ mode: String }, modeType),
  transit: modeType,
  walk: modeType
})

schema.plugin(trashPlugin)

module.exports = schema
