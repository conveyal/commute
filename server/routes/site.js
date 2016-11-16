import {Site} from '../models'
import {makeRestEndpoints} from './'

export default function makeRoutes (app) {
  makeRestEndpoints(app,
    'site',
    {
      'Collection GET': {},
      'Collection POST': {},
      'GET': {},
      'DELETE': {},
      'PUT': {}
    },
    Site
  )
}
