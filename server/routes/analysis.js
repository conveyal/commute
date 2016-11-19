const models = require('../models')
const makeRestEndpoints = require('./').makeRestEndpoints

module.exports = function makeRoutes (app) {
  makeRestEndpoints(app,
    'analysis',
    {
      'Collection GET': {},
      'Collection POST': {},
      'GET': {},
      'DELETE': {}
    },
    models.Analysis
  )
}
