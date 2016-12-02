/* globals describe */

import {blankOrganization, mockStores, organizationWithAnAnalysis} from '../../test-utils/mock-data'
import {makeChildrenHandlerTestCases, makeGenericReducerTestCases} from '../../test-utils/reducers'

import * as organization from '../../../client/reducers/organization'

describe('client > reducers > organization', () => {
  makeChildrenHandlerTestCases({
    add: {
      affectedParentId: 'organization-1',
      initialState: mockStores.withBlankOrganization.organization,
      payload: { _id: 'analysis-new', organizationId: 'organization-1' }
    },
    childPluralName: 'analyses',
    childSingularName: 'analysis',
    delete: {
      affectedParentId: 'organization-2',
      initialState: mockStores.withAnalysisRun.organization,
      payload: { _id: 'analysis-2', organizationId: 'organization-2' }
    },
    initialState: organization.initialState,
    reducers: organization.reducers
  })

  makeChildrenHandlerTestCases({
    add: {
      affectedParentId: 'organization-1',
      initialState: mockStores.withBlankOrganization.organization,
      payload: { _id: 'group-new', organizationId: 'organization-1' }
    },
    childPluralName: 'groups',
    childSingularName: 'group',
    delete: {
      affectedParentId: 'organization-2',
      initialState: mockStores.withAnalysisRun.organization,
      payload: { _id: 'group-2', organizationId: 'organization-2' }
    },
    initialState: organization.initialState,
    reducers: organization.reducers
  })

  makeChildrenHandlerTestCases({
    add: {
      affectedParentId: 'organization-1',
      initialState: mockStores.withBlankOrganization.organization,
      payload: { _id: 'site-new', organizationId: 'organization-1' }
    },
    childPluralName: 'sites',
    childSingularName: 'site',
    delete: {
      affectedParentId: 'organization-2',
      initialState: mockStores.withAnalysisRun.organization,
      payload: { _id: 'site-2', organizationId: 'organization-2' }
    },
    initialState: organization.initialState,
    reducers: organization.reducers
  })

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
      'set many': {
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
