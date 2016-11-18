/* globals describe */

import {blankOrganization, mockStores, organizationWithAnAnalysis} from '../../test-utils/mock-data'
import {makeGenericReducerTestCases} from '../../test-utils/reducers'

import * as organization from '../../../client/reducers/organization'

describe('client > reducers > organization', () => {
  makeGenericReducerTestCases({
    handlers: {
      add: {
        initialState: organization.initialState,
        payload: blankOrganization
      },
      delete: {
        initialState: mockStores.withBlankOrganization.organization,
        payload: 'organization-1'
      },
      set: {
        initialState: mockStores.withBlankOrganization.organization,
        payload: organizationWithAnAnalysis
      },
      'set all': {
        initialState: organization.initialState,
        payload: [blankOrganization, organizationWithAnAnalysis]
      }
    },
    initialState: organization.initialState,
    name: {
      plural: 'organizations',
      singular: 'organization'
    },
    reducers: organization.reducers
  })
})
