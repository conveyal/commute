const pick = require('lodash.pick')

const models = require('../models')
const makeRestEndpoints = require('./').makeRestEndpoints

module.exports = function makeRoutes (app) {
  makeRestEndpoints(app,
    'group',
    {
      'Collection GET': {},
      'GET': {},
      'DELETE': {},
      'PUT': {}
    },
    models.Group
  )

  // rest-ish endpoints
  app.post('/api/group', (req, res) => {
    res.set('Content-Type', 'application/json')
    const handleErr = (err) => res.status(500).json({error: err})
    models.Group.create(pick(req.body, ['name', 'organization']))
      .then((group) => {
        if (req.body.commuters && req.body.commuters.length > 0) {
          // insert commuters one-by-one to trigger pre-save hook
          Promise.all(req.body.commuters.map((commuter) => {
            return models.Commuter.create(Object.assign(commuter, { group: group._id }))
          }))
            .then((data) => {
              res.json(group)
            })
            .catch(handleErr)
        } else {
          res.json(group)
        }
      })
      .catch(handleErr)
  })
}
