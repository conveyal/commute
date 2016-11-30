/* global describe */

import {makeGenericModelActionsTests} from '../../test-utils/actions'
import {blankAgency} from '../../test-utils/mock-data'

import * as agency from '../../../client/actions/agency'

describe('actions > agency', () => {
  makeGenericModelActionsTests({
    actions: agency,
    commands: {
      'Collection GET': {},
      'Collection POST': {
        args: {
          name: 'New Agency'
        }
      },
      'DELETE': {
        args: blankAgency
      },
      'GET': {
        args: 'entity-id'
      },
      'PUT': {
        args: blankAgency
      }
    },
    pluralName: 'agencies',
    singularName: 'agency'
  })
})
