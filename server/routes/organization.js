const models = require('../models')
const makeRestEndpoints = require('../utils/restEndpoints')

module.exports = function makeRoutes (app) {
  makeRestEndpoints(app,
    {
      childModels: [{
        foreignKey: 'organizationId',
        key: 'analyses',
        model: models.Analysis
      }, {
        foreignKey: 'organizationId',
        key: 'groups',
        model: models.Group
      }, {
        foreignKey: 'organizationId',
        key: 'sites',
        model: models.Site
      }],
      commands: {
        'Collection GET': {},
        'Collection POST': {},
        'GET': {},
        'DELETE': {},
        'PUT': {}
      },
      model: models.Organization,
      name: 'organization'
    }
  )
}
