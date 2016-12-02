/* globals describe */

import {mockSite, mockStores} from '../../test-utils/mock-data'
import {makeGenericReducerTestCases} from '../../test-utils/reducers'

import * as site from '../../../client/reducers/site'

describe('client > reducers > site', () => {
  makeGenericReducerTestCases({
    handlers: {
      add: {
        initialState: site.initialState,
        payload: mockSite
      },
      delete: {
        initialState: mockStores.withAnalysisRun.site,
        payload: 'site-2'
      },
      set: {
        initialState: mockStores.withBlankOrganization.site,
        payload: mockSite
      },
      'set many': {
        initialState: site.initialState,
        payload: [mockSite]
      }
    },
    initialState: site.initialState,
    name: {
      plural: 'sites',
      singular: 'site'
    },
    reducers: site.reducers
  })
})
