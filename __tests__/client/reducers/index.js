/* globals describe, expect, it */
import {combineReducers} from 'redux'

import allReducers from '../../../client/reducers'

const rootReducer = combineReducers(allReducers)

describe('reducers > root', () => {
  it('should have default state', () => {
    expect(rootReducer(undefined, { type: 'blah', payload: {} })).toMatchSnapshot()
  })
})
