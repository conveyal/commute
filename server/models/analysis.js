const {Schema} = require('mongoose')

const db = require('../db')
const Commuter = db.model('Commuter', require('./commuter'))
const Group = db.model('Group', require('./group'))
const trashPlugin = require('./plugins/trash')
const Site = db.model('Site', require('./site'))
const Trip = db.model('Trip', require('./trip'))
const dbUtils = require('../utils/db')
const later = require('../utils/later')

const schema = new Schema({
  calculationStatus: {
    default: 'calculating',
    required: true,
    type: String
  },
  groupId: {
    ref: 'Group',
    required: true,
    type: Schema.Types.ObjectId
  },
  name: {
    required: true,
    type: String
  },
  numCommuters: {
    default: 0,
    required: true,
    type: Number
  },
  organizationId: {
    ref: 'Organization',
    required: true,
    type: Schema.Types.ObjectId
  },
  siteId: {
    ref: 'Site',
    required: true,
    type: Schema.Types.ObjectId
  },
  summary: {
    // fields
    avgTravelTime: Number,
    avgDistance: Number,
    savingsPerTrip: Number,
    savingsPerTripYear: Number,
    savingsTotalPerDay: Number,
    savingsTotalPerYear: Number,

    // mongoose
    default: {
      avgTravelTime: 0,
      avgDistance: 0,
      savingsPerTrip: 0,
      savingsPerTripYear: 0,
      savingsTotalPerDay: 0,
      savingsTotalPerYear: 0
    },
    required: true,
    type: Schema.Types.Mixed
  }
})

schema.plugin(trashPlugin)

schema.pre('save', dbUtils.makeCascadeDeleteModelsFn('analysisId', [Trip]))

schema.pre('save', true, function (next, done) {
  next()

  const self = this

  if (['skipCalculation', 'calculated'].indexOf(this.calculationStatus) !== -1 ||
    this.trashed) return done()

  const profiler = require('../utils/profiler')

  // initiate profile analysis of all commuters in group
  // find all commuters via groupId
  // make sure group isn't trashed
  const ensureGroupExists = Group.count({ _id: this.groupId, trashed: undefined }).exec()
  const findCommuters = Commuter.find({ groupId: this.groupId, trashed: undefined }).exec()
  const getSite = Site.findOne({ _id: this.siteId, trashed: undefined }).exec()
  Promise.all([findCommuters, getSite, ensureGroupExists])
    .then((results) => {
      // verify that group, commuters and site exist
      const commuters = results[0]
      const site = results[1]
      const groupCount = results[2]

      if (commuters.length === 0) return done('No commuters found!')
      if (!site) return done('Site not found!')
      if (groupCount === 0) return done('Group not found!')

      self.numCommuters = commuters.length

      later(() => {
        profiler({
          analysisId: self._id,
          commuters,
          site
        })
      })
      done()
    })
    .catch((err) => {
      console.error(err)
      self.calculationStatus = 'error'
      done()
    })
})

module.exports = schema
