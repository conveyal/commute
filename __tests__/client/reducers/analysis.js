/* globals describe, expect, it */

import omit from 'lodash.omit'
import {handleActions} from 'redux-actions'

import {mockAnalysis, mockStores} from '../../test-utils/mock-data'
import {makeGenericReducerTestCases} from '../../test-utils/reducers'

import * as analysis from '../../../client/reducers/analysis'

describe('client > reducers > analysis', () => {
  const mockAnalysisFromServer = omit(mockAnalysis, 'tripVals')
  makeGenericReducerTestCases({
    handlers: {
      add: {
        initialState: analysis.initialState,
        payload: Object.assign({},
          mockAnalysisFromServer,
          {
            calculationStatus: 'calculating',
            trips: []
          }
        )
      },
      delete: {
        initialState: mockStores.withAnalysisRun.analysis,
        payload: mockAnalysisFromServer
      },
      'set many': {
        initialState: analysis.initialState,
        payload: [mockAnalysisFromServer]
      }
    },
    initialState: analysis.initialState,
    name: {
      plural: 'analyses',
      singular: 'analysis'
    },
    reducers: analysis.reducers
  })

  it('should handle set analysis with no trips calculated yet', () => {
    const reducer = handleActions(analysis.reducers, analysis.initialState)
    const entity = Object.assign({}, mockAnalysisFromServer, { trips: [] })
    const action = { payload: entity, type: 'set analysis' }
    const result = reducer(analysis.initialState, action)
    expect(result[entity._id]).toEqual(entity)
    expect(result).toMatchSnapshot()
  })
})
