import {Commuter} from '../models'
import {makeRestEndpoints} from './'

export default function makeRoutes (app) {
  makeRestEndpoints(app,
    'commuter',
    {
      'Collection GET': {},
      'Collection POST': {},
      'GET': {},
      'DELETE': {},
      'PUT': {}
    },
    Commuter
  )
}
