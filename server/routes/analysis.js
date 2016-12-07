const models = require('../models')
const makeRestEndpoints = require('./').makeRestEndpoints

module.exports = function makeRoutes (app) {
  makeRestEndpoints(app,
    {
      commands: {
        'Collection GET': {},
        'Collection POST': {},
        'GET': {},
        'DELETE': {}
      },
      model: models.Analysis,
      name: 'analysis'
    }
  )
}
