/* globals describe */

import {commuterSal, mockCommuter, mockStores} from '../../test-utils/mock-data'
import {makeGenericReducerTestCases} from '../../test-utils/reducers'

import * as commuter from '../../../client/reducers/commuter'

describe('client > reducers > commuter', () => {
  makeGenericReducerTestCases({
    handlers: {
      add: {
        initialState: commuter.initialState,
        payload: mockCommuter
      },
      delete: {
        initialState: mockStores.withSite.commuter,
        payload: mockCommuter
      },
      set: {
        initialState: mockStores.withSite.commuter,
        payload: commuterSal
      },
      'set many': {
        initialState: commuter.initialState,
        payload: [mockCommuter]
      }
    },
    initialState: commuter.initialState,
    name: {
      plural: 'commuters',
      singular: 'commuter'
    },
    reducers: commuter.reducers
  })
})
