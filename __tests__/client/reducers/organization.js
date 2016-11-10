/* globals describe, expect, it */

import {handleActions} from 'redux-actions'

import {mockGroup, mockSite, mockStores, mockTrip} from '../../test-utils/mock-data'
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

  /**
   * Analysis Tests
   */

  it('should handle add analysis', () => {
    const newAnalysis = {
      id: '2',
      groupId: '1',
      lastRunDateTime: 1477777777,
      name: 'Another Analysis',
      siteId: '1'
    }
    const action = { type: 'add analysis', payload: { organizationId: '2', analysis: newAnalysis } }
    const result = reducer(mockStores.complexOrganization.organization, action)
    expect(result.organizationsById['2'].analyses.length).toBe(2)
    expect(result).toMatchSnapshot()
  })

  it('should handle delete analysis', () => {
    const action = { type: 'delete analysis', payload: { organizationId: '2', analysisId: '1' } }
    const result = reducer(mockStores.complexOrganization.organization, action)
    expect(result.organizationsById['2'].analyses.length).toBe(0)
    expect(result).toMatchSnapshot()
  })

  it('should handle receive mock calculated trips', () => {
    const calculatedTrip = Object.assign(mockTrip, {
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
        organizationId: '2',
        analysisId: '1',
        trips: [calculatedTrip]
      }
    }
    const result = reducer(mockStores.complexOrganization.organization, action)
    expect(result.organizationsById['2'].analysesById['2'].trips.length).toBe(1)
    expect(result).toMatchSnapshot()
  })

  /**
   * Commuter Stuff
   */

  const commuterSal = {
    address: '9876 ABC Ct',
    email: 'sal@a.mander',
    id: '2',
    lat: 38.915,
    lng: -76.971,
    name: 'Sal A. Mander'
  }

  it('should handle add commuter', () => {
    const action = {
      type: 'add commuter',
      payload: {
        commuter: commuterSal,
        organizationId: '2',
        groupId: '1'
      }
    }
    const result = reducer(mockStores.complexOrganization.organization, action)
    expect(result.organizationsById['2'].groupsById['1'].commuters.length).toBe(2)
    expect(result).toMatchSnapshot()
  })

  it('should handle delete commuter', () => {
    const action = {
      type: 'delete commuter',
      payload: { analysisId: '1', commuterId: '1', organizationId: '2' }
    }
    const result = reducer(mockStores.complexOrganization.organization, action)
    expect(result.organizationsById['2'].groupsById['1'].commuters.length).toBe(0)
    expect(result).toMatchSnapshot()
  })

  it('should handle update commuter', () => {
    const action = {
      type: 'update commuter',
      payload: {
        commuter: commuterSal,
        organizationId: '2',
        groupId: '1'
      }
    }
    const result = reducer(mockStores.complexOrganization.organization, action)
    expect(result.organizationsById['2'].groupsById['1'].commuters.length).toBe(1)
    expect(result).toMatchSnapshot()
  })

  /**
   * Group Stuff
   */

  it('should handle add group', () => {
    const action = { type: 'add group', payload: { organizationId: '1', group: mockGroup } }
    const result = reducer(mockStores.oneSimpleOrganization.organization, action)
    expect(result.organizationsById['1'].groups.length).toBe(1)
    expect(result).toMatchSnapshot()
  })

  it('should handle append commuters', () => {
    const action = {
      type: 'append commuters',
      payload: {
        commuters: [commuterSal],
        groupId: '1',
        organizationId: '1'
      }
    }
    const result = reducer(mockStores.complexOrganization.organization, action)
    expect(result.organizationsById['2'].groupsById['1'].commuters.length).toBe(2)
    expect(result).toMatchSnapshot()
  })

  it('should handle delete group', () => {
    const action = { type: 'delete group', payload: { organizationId: '2', groupId: '1' } }
    const result = reducer(mockStores.complexOrganization.organization, action)
    expect(result.organizationsById['2'].groups.length).toBe(0)
    expect(result).toMatchSnapshot()
  })

  /**
   * Site Stuff
   */

  it('should handle add site', () => {
    const action = { type: 'add site', payload: { organizationId: '1', site: mockSite } }
    const result = reducer(mockStores.oneSimpleOrganization.organization, action)
    expect(result.organizationsById['1'].sites.length).toBe(1)
    expect(result).toMatchSnapshot()
  })

  it('should handle delete site', () => {
    const action = { type: 'delete site', payload: { organizationId: '2', siteId: '1' } }
    const result = reducer(mockStores.complexOrganization.organization, action)
    expect(result.organizationsById['2'].sites.length).toBe(0)
    expect(result).toMatchSnapshot()
  })

  it('should handle update site', () => {
    const siteUpdate = Object.assign(mockSite, { name: 'Delta Corp', address: '456 DEF Rd' })
    const action = { type: 'update site', payload: { organizationId: '2', site: siteUpdate } }
    const result = reducer(mockStores.complexOrganization.organization, action)
    expect(result.organizationsById['2'].sites.length).toBe(1)
    expect(result).toMatchSnapshot()
  })
})
