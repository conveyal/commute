/* globals describe, expect, it */

import {handleActions} from 'redux-actions'

import {mockSite, mockStores} from '../../test-utils/mock-data'
import * as organization from '../../../client/reducers/organization'

describe('client > reducers > organization', () => {
  const reducer = handleActions(organization.reducers)

  // Default State Test
  it('should handle default state', () => {
    const result = reducer(organization.initialState, { type: 'blah', payload: {} })
    expect(result.organizations.length).toBe(0)
    expect(result).toMatchSnapshot()
  })

  // Specific Handler Tests
  // Organization Tests
  it('should handle add organization', () => {
    const action = { type: 'add organization', payload: { id: 1 } }
    const result = reducer(organization.initialState, action)
    expect(result.organizations.length).toBe(1)
    expect(result).toMatchSnapshot()
  })

  it('should handle set organizations', () => {
    const action = { type: 'set organizations', payload: [{ id: 1 }] }
    const result = reducer(organization.initialState, action)
    expect(result.organizations.length).toBe(1)
    expect(result).toMatchSnapshot()
  })

  // Site Tests
  it('should handle add site', () => {
    mockSite.organizationId = '1'
    const action = { type: 'add site', payload: mockSite }
    const result = reducer(mockStores.oneSimpleOrganization.organization, action)
    expect(result.organizationsById['1'].sites.length).toBe(1)
    expect(result).toMatchSnapshot()
  })
})
