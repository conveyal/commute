import pick from 'lodash.pick'

import {Commuter, Group} from '../models'
import {makeRestEndpoints} from './'

export default function makeRoutes (app) {
  makeRestEndpoints(app,
    'group',
    {
      'Collection GET': {},
      'GET': {},
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
          // insert commuters one-by-one to trigger pre-save hook
          Promise.all(req.body.commuters.map((commuter) => {
            return Commuter.create(Object.assign(commuter, { group: group._id }))
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
