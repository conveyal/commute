/* global describe */

import {makeGenericModelActionsTests} from '../../test-utils/actions'
import {blankOrganization} from '../../test-utils/mock-data'

import * as organization from '../../../client/actions/organization'

describe('actions > organization', () => {
  makeGenericModelActionsTests({
    actions: organization,
    commands: {
      'Collection GET': {},
      'Collection POST': {
        args: {
          name: 'New Organization'
        }
      },
      'DELETE': {
        args: blankOrganization
      },
      'GET': {
        args: 'entity-id'
      },
      'PUT': {
        args: blankOrganization
      }
    },
    pluralName: 'organizations',
    singularName: 'organization'
  })
})
