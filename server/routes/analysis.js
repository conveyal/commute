import {Analysis} from '../models'
import {makeRestEndpoints} from './'

export default function makeRoutes (app) {
  makeRestEndpoints(app,
    'analysis',
    {
      'Collection GET': {},
      'Collection POST': {},
      'GET': {},
      'DELETE': {}
    },
    Analysis
  )
}
