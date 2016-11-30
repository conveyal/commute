/* global describe */

import {makeGenericModelActionsTests} from '../../test-utils/actions'
import {mockGroup, mockGroupCreation} from '../../test-utils/mock-data'

import * as group from '../../../client/actions/group'

describe('actions > group', () => {
  makeGenericModelActionsTests({
    actions: group,
    commands: {
      'Collection GET': {},
      'Collection POST': {
        args: mockGroupCreation
      },
      'DELETE': {
        args: mockGroup
      },
      'GET': {
        args: 'entity-id'
      },
      'PUT': {
        args: mockGroup
      }
    },
    pluralName: 'groups',
    singularName: 'group'
  })
})
