/* globals describe, expect, it */

import { handleActions } from 'redux-actions'

import * as organization from '../../../client/reducers/organization'

describe('client > reducers > organization', () => {
  const reducer = handleActions(organization.reducers, organization.initialState)

  // Default State Test
  it('should handle default state', () => {
    expect(reducer(undefined, { type: 'blah', payload: {} })).toMatchSnapshot()
  })

  // Specific Handler Tests
  it('should handle set organizations', () => {
    const action = { type: 'set organizations', payload: {} }
    expect(reducer(undefined, action)).toMatchSnapshot()
  })
})
