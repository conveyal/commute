const models = require('../models')
const makeRestEndpoints = require('../utils/restEndpoints')

module.exports = function makeRoutes (app) {
  makeRestEndpoints(app,
    {
      childModels: [{
        foreignKey: 'agencyId',
        key: 'organizations',
        model: models.Organization
      }],
      commands: {
        'Collection GET': {},
        'Collection POST': {},
        'GET': {},
        'DELETE': {},
        'PUT': {}
      },
      model: models.Agency,
      name: 'agency'
    }
  )
}
