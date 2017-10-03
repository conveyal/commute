const models = require('../models')
const endpointFactory = require('../utils/restEndpoints')

module.exports = function makeRoutes (app, jwt) {
  const baseCfg = {
    model: models.Polygon,
    name: 'polygon'
  }
  endpointFactory.makeRestEndpoints(
    app,
    jwt,
    Object.assign(
      {
        commands: {
          'Collection DELETE': {},
          'Collection GET': {}
        }
      },
      baseCfg
    )
  )
  endpointFactory.makePublicRestEndpoints(app, baseCfg)
}
