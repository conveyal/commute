/* globals describe */

import {agencyWithAnOrganization, blankAgency, mockStores} from '../../test-utils/mock-data'
import {makeChildrenHandlerTestCases, makeGenericReducerTestCases} from '../../test-utils/reducers'

import * as agency from '../../../client/reducers/agency'

describe('client > reducers > agency', () => {
  makeChildrenHandlerTestCases({
    add: {
      affectedParentId: 'agency-1',
      initialState: mockStores.withBlankAgency.agency,
      payload: { id: 'organization-new', agencyId: 'agency-1' }
    },
    childPluralName: 'organizations',
    childSingularName: 'organization',
    delete: {
      affectedParentId: 'agency-3',
      initialState: mockStores.withBlankOrganization.agency,
      payload: { id: 'organization-1', agencyId: 'agency-3' }
    },
    initialState: agency.initialState,
    reducers: agency.reducers
  })

  makeGenericReducerTestCases({
    handlers: {
      add: {
        initialState: agency.initialState,
        payload: blankAgency
      },
      delete: {
        initialState: mockStores.withBlankAgency.agency,
        payload: 'agency-1'
      },
      set: {
        initialState: mockStores.withBlankAgency.agency,
        payload: agencyWithAnOrganization
      },
      'set all': {
        initialState: agency.initialState,
        payload: [blankAgency, agencyWithAnOrganization]
      }
    },
    initialState: agency.initialState,
    name: {
      plural: 'agencies',
      singular: 'agency'
    },
    reducers: agency.reducers
  })
})
