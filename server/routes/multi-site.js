const models = require('../models')
const makeRestEndpoints = require('../utils/restEndpoints')

module.exports = function makeRoutes (app, jwt) {
  makeRestEndpoints(app, jwt,
    {
      commands: {
        'Collection GET': {},
        'Collection POST': {},
        'GET': {},
        'DELETE': {},
        'PUT': {}
      },
      model: models.MultiSite,
      name: 'multi-site'
    }
  )
}
