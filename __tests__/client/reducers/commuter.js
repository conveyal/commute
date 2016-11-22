/* globals describe, expect, it */

import {handleActions} from 'redux-actions'

import {commuterSal, mockCommuter, mockGroupCreation, mockStores} from '../../test-utils/mock-data'
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
        initialState: mockStores.withAnalysisRun.commuter,
        payload: 'commuter-2'
      },
      set: {
        initialState: mockStores.withAnalysisRun.commuter,
        payload: commuterSal
      },
      'set all': {
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

  it('should handle add group', () => {
    const reducer = handleActions(commuter.reducers, commuter.initialState)
    const newGroup = {...mockGroupCreation}
    const action = { payload: newGroup, type: 'add group' }
    const result = reducer(mockStores.withBlankOrganization.commuter, action)
    expect(result['new-commuter'].name).toEqual('Fake Commuter')
    expect(result).toMatchSnapshot()
  })

  it('should handle append commuters', () => {
    const reducer = handleActions(commuter.reducers, commuter.initialState)
    const action = {
      type: 'append commuters',
      payload: {
        groupId: 'group-2',
        commuters: [commuterSal]
      }
    }
    const result = reducer(mockStores.withAnalysisRun.commuter, action)
    expect(result['commuter-3']).toEqual(commuterSal)
    expect(result).toMatchSnapshot()
  })
})
