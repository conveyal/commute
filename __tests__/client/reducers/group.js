/* globals describe, expect, it */

import {handleActions} from 'redux-actions'

import {commuterSal, mockStores} from '../../test-utils/mock-data'
import {makeGenericReducerTestCases} from '../../test-utils/reducers'

import * as group from '../../../client/reducers/group'

describe('client > reducers > group', () => {
  const anotherGroup = { id: 'group-3', name: 'Another Group', commuters: [] }

  makeGenericReducerTestCases({
    handlers: {
      add: {
        initialState: group.initialState,
        payload: anotherGroup
      },
      delete: {
        initialState: mockStores.withAnalysisRun.group,
        payload: 'group-2'
      },
      set: {
        initialState: mockStores.withBlankOrganization.group,
        payload: anotherGroup
      },
      'set all': {
        initialState: group.initialState,
        payload: [anotherGroup]
      }
    },
    initialState: group.initialState,
    name: {
      plural: 'groups',
      singular: 'group'
    },
    reducers: group.reducers
  })

  it('should handle append commuters', () => {
    const reducer = handleActions(group.reducers, group.initialState)
    const action = {
      type: 'append commuters',
      payload: {
        groupId: 'group-2',
        commuters: [commuterSal]
      }
    }
    const result = reducer(mockStores.withAnalysisRun.group, action)
    expect(result['group-2'].commuters.length).toBe(2)
    expect(result).toMatchSnapshot()
  })
})
