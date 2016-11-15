import {Organization} from '../models'
import {makeRestEndpoints} from './'

export default function makeRoutes (app) {
  makeRestEndpoints(app,
    'organization',
    {
      'Collection GET': {},
      'Collection POST': {},
      'DELETE': {},
      'PUT': {}
    },
    Organization
  )
}
