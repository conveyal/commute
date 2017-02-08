const models = require('../models')
const makeRestEndpoints = require('../utils/restEndpoints')

module.exports = function makeRoutes (app, jwt) {
  makeRestEndpoints(app, jwt,
    {
      commands: {
        'Collection DELETE': {},
        'Collection GET': {}
      },
      model: models.Polygon,
      name: 'polygon'
    }
  )
}
