/* global describe */

import {makeGenericModelActionsTests} from '../../test-utils/actions'
import {mockCommuter} from '../../test-utils/mock-data'

import * as commuter from '../../../client/actions/commuter'

describe('actions > commuter', () => {
  makeGenericModelActionsTests({
    actions: commuter,
    commands: {
      'Collection GET': {},
      'Collection POST': {
        args: {
          siteId: 'site-id',
          name: 'New Commuter'
        }
      },
      'DELETE': {
        args: mockCommuter
      },
      'GET': {
        args: 'entity-id'
      },
      'PUT': {
        args: mockCommuter
      }
    },
    pluralName: 'commuters',
    singularName: 'commuter'
  })
})
