/* globals describe, expect, it */

import {handleActions} from 'redux-actions'

import * as user from '../../../client/reducers/user'

describe('client > reducers > user', () => {
  const reducer = handleActions(user.reducers, user.initialState)

  // Default State Test
  it('should handle default state', () => {
    expect(reducer(undefined, { type: 'blah', payload: {} })).toMatchSnapshot()
  })

  // Specific Handler Tests
  it('should handle log out', () => {
    const action = { type: 'log out', payload: {} }
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set auth0 user', () => {
    const action = { type: 'set auth0 user', payload: { id: 1 } }
    expect(reducer(undefined, action)).toMatchSnapshot()
  })

  it('should handle set id token', () => {
    const action = { type: 'set id token', payload: 'abcd' }
    expect(reducer(undefined, action)).toMatchSnapshot()
  })
})
