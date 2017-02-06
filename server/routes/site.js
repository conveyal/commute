const models = require('../models')
const makeRestEndpoints = require('../utils/restEndpoints')

module.exports = function makeRoutes (app, jwt) {
  makeRestEndpoints(app, jwt,
    {
      childModels: [{
        foreignKey: 'siteId',
        key: 'commuters',
        model: models.Commuter
      }],
      commands: {
        'Collection GET': {},
        'Collection POST': {},
        'GET': {},
        'DELETE': {},
        'PUT': {}
      },
      model: models.Site,
      name: 'site'
    }
  )
}
