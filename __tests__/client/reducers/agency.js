/* globals describe */

import {agencyWithAnOrganization, blankAgency, mockStores} from '../../test-utils/mock-data'
import {makeGenericReducerTestCases} from '../../test-utils/reducers'

import * as agency from '../../../client/reducers/agency'

describe('client > reducers > agency', () => {
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
