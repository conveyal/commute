const models = require('../models')
const endpointFactory = require('../utils/restEndpoints')

module.exports = function makeRoutes (app, jwt) {
  const baseCfg = {
    childModels: [{
      foreignKey: 'siteId',
      key: 'commuters',
      model: models.Commuter
    }],
    model: models.Site,
    name: 'site'
  }
  endpointFactory.makeRestEndpoints(app, jwt, Object.assign({
    commands: {
      'Collection GET': {},
      'Collection POST': {},
      'GET': {},
      'DELETE': {},
      'PUT': {}
    }
  }, baseCfg))
  endpointFactory.makePublicRestEndpoints(app, baseCfg)
}
