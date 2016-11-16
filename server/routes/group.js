import pick from 'lodash.pick'

import {Commuter, Group} from '../models'
import {makeRestEndpoints} from './'

export default function makeRoutes (app) {
  makeRestEndpoints(app,
    'group',
    {
      'Collection GET': {},
      'DELETE': {},
      'PUT': {}
    },
    Group
  )

  // rest-ish endpoints
  app.post('/api/group', (req, res) => {
    const handleErr = (err) => res.status(500).json({error: err})
    Group.create(pick(req.body, ['name', 'organization']))
      .then((group) => {
        if (req.body.commuters && req.body.commuters.length > 0) {
          const commuters = req.body.commuters.map((commuter) => {
            return Object.assign(commuter, { group: group._id })
          })
          Commuter.insertMany(commuters)
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
