const pick = require('lodash.pick')

const models = require('../models')
const makeRestEndpoints = require('./').makeRestEndpoints

module.exports = function makeRoutes (app) {
  makeRestEndpoints(app,
    {
      childModels: [{
        foreignKey: 'groupId',
        key: 'commuters',
        model: models.Commuter
      }],
      commands: {
        'Collection GET': {},
        'GET': {},
        'DELETE': {},
        'PUT': {}
      },
      model: models.Group,
      name: 'group'
    }
  )

  // rest-ish endpoints
  app.post('/api/group', (req, res) => {
    res.set('Content-Type', 'application/json')
    const handleErr = (err) => res.status(500).json({error: err})
    models.Group.create(pick(req.body, ['name', 'organizationId']))
      .then((group) => {
        if (req.body.commuters && req.body.commuters.length > 0) {
          // insert commuters one-by-one to trigger pre-save hook
          Promise.all(req.body.commuters.map((commuter) => {
            return models.Commuter.create(Object.assign(commuter, { groupId: group._id }))
          }))
            .then((data) => {
              const output = Object.assign({ commuters: data.map((commuter) => commuter._id) }, group._doc)
              res.json(output)
            })
            .catch(handleErr)
        } else {
          res.json(group)
        }
      })
      .catch(handleErr)
  })
}
