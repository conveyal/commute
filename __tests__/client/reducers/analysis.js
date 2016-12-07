/* globals describe, expect, it */

import {handleActions} from 'redux-actions'

import {mockAnalysis, mockStores, mockTrip} from '../../test-utils/mock-data'
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

  it('should handle receive mock calculated trips', () => {
    const reducer = handleActions(analysis.reducers, analysis.initialState)

    const calculatedTrip = Object.assign({}, mockTrip, {
      mostLikely: {
        cost: 4.56,
        distance: 22,
        time: 2321,
        mode: 'transit',
        polygon: 'encoded'
      }
    })
    const action = {
      type: 'receive mock calculated trips',
      payload: {
        analysisId: 'analysis-2',
        trips: [calculatedTrip]
      }
    }
    const result = reducer(mockStores.withAnalysisRun.analysis, action)
    const affectedAnalysis = result['analysis-2']
    expect(affectedAnalysis.trips.length).toBe(1)
    expect(affectedAnalysis.tripVals.bike.cost.length).toBe(1)
    expect(affectedAnalysis).toMatchSnapshot()
  })
})
