const models = require('../models')
const makeRestEndpoints = require('../utils/restEndpoints')

module.exports = function makeRoutes (app) {
  makeRestEndpoints(app,
    {
      childModels: [{
        foreignKey: 'anlaysisId',
        key: 'trips',
        model: models.Trip
      }],
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
