/* global describe */

import {makeGenericModelActionsTests} from '../../test-utils/actions'
import {mockSite} from '../../test-utils/mock-data'

import * as site from '../../../client/actions/site'

describe('actions > site', () => {
  makeGenericModelActionsTests({
    actions: site,
    commands: {
      'Collection GET': {},
      'Collection POST': {
        args: {
          name: 'New Site'
        }
      },
      'DELETE': {
        args: mockSite
      },
      'GET': {
        args: 'entity-id'
      },
      'PUT': {
        args: mockSite
      }
    },
    pluralName: 'sites',
    singularName: 'site'
  })
})
