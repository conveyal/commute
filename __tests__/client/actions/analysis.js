/* global describe */

import {makeGenericModelActionsTests} from '../../test-utils/actions'
import {mockAnalysis} from '../../test-utils/mock-data'

import * as analysis from '../../../client/actions/analysis'

describe('actions > analysis', () => {
  makeGenericModelActionsTests({
    actions: analysis,
    commands: {
      'Collection GET': {},
      'Collection POST': {
        args: {
          name: 'New Analysis',
          organizationId: 'organization-id'
        }
      },
      'DELETE': {
        args: mockAnalysis
      },
      'GET': {
        args: 'entity-id'
      }
    },
    pluralName: 'analyses',
    singularName: 'analysis'
  })
})
