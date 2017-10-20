/* globals describe, expect, it */
import {combineReducers} from 'redux'

describe('reducers > root', () => {
  it('should have default state', () => {
    window.localStorage = {
      getItem: () => JSON.stringify({})
    }

    const allReducers = require('../../../client/reducers')

    const rootReducer = combineReducers(allReducers)

    expect(rootReducer(undefined, { type: 'blah', payload: {} })).toMatchSnapshot()
  })
})
