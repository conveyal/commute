/* globals describe */

import {mockAnalysis, mockStores} from '../../test-utils/mock-data'
import {makeGenericReducerTestCases} from '../../test-utils/reducers'

import * as analysis from '../../../client/reducers/analysis'

describe('client > reducers > analysis', () => {
  makeGenericReducerTestCases({
    handlers: {
      add: {
        initialState: analysis.initialState,
        payload: mockAnalysis
      },
      delete: {
        initialState: mockStores.withAnalysisRun.analysis,
        payload: mockAnalysis
      },
      'set many': {
        initialState: analysis.initialState,
        payload: [mockAnalysis]
      }
    },
    initialState: analysis.initialState,
    name: {
      plural: 'analyses',
      singular: 'analysis'
    },
    reducers: analysis.reducers
  })
})
