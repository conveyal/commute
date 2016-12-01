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
    let body = req.body
    if (!Array.isArray(body)) {
      body = [body]
    }
    const groupsToCreate = body.map((newGroup) => pick(newGroup, ['name', 'organizationId']))
    models.Group.create(groupsToCreate)
      .then((groups) => {
        const createGroupCommutersPromises = groups.map((group, idx) => {
          return new Promise((resolve, reject) => {
            if (body[idx].commuters && body[idx].commuters.length > 0) {
              // insert commuters one-by-one to trigger pre-save hook
              Promise.all(body[idx].commuters.map((commuter) => {
                return models.Commuter.create(Object.assign(commuter, { groupId: group._id }))
              }))
                .then((data) => {
                  const output = Object.assign({ commuters: data.map((commuter) => commuter._id) }, group._doc)
                  resolve(output)
                })
                .catch(reject)
            } else {
              resolve(group)
            }
          })
        })
        Promise.all(createGroupCommutersPromises)
          .then((data) => {
            res.json(data)
          })
          .catch((err) => {
            handleErr(err)
          })
      })
      .catch(handleErr)
  })
}
