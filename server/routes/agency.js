const models = require('../models')
const makeRestEndpoints = require('./').makeRestEndpoints

module.exports = function makeRoutes (app) {
  makeRestEndpoints(app,
    'agency',
    {
      'Collection GET': {},
      'Collection POST': {},
      'GET': {},
      'DELETE': {},
      'PUT': {}
    },
    models.Agency
  )
}
