import multi from 'mastarm/react/store/multi'
import configureStore from 'redux-mock-store'
import promise from 'redux-promise'

export const makeMockStore = configureStore([multi, promise])

export const simpleOrganization = {
  analyses: [],
  analysesById: {},
  id: '1',
  contact: 'someone',
  email: 'abc@def.ghi',
  groups: [],
  groupsById: {},
  logo_url: 'https://placekitten.com/80/80',
  main_url: 'https://placekitten.com/',
  name: 'Mock Organization',
  sites: [],
  sitesById: {}
}

export const mockAnalysis = {
  id: '1',
  groupId: '1',
  lastRunDateTime: 1477697490,
  name: 'An Analysis',
  siteId: '1',
  trips: []
}
export const mockGroup = { id: '1', name: 'Mock Group', commuters: [] }
export const mockSite = { id: '1', name: 'Acme Corp', address: '123 ABC St' }

export const complexOrganization = {
  analyses: [mockAnalysis],
  analysesById: { '1': mockAnalysis },
  id: '2',
  contact: 'someone',
  email: 'abc@def.ghi',
  groups: [mockGroup],
  groupsById: { '1': mockGroup },
  logo_url: 'https://placekitten.com/80/80',
  main_url: 'https://placekitten.com/',
  name: 'Mock Organization',
  sites: [mockSite],
  sitesById: { '1': mockSite }
}

export const mockStores = {
  init: {
    user: {},
    organization: {
      organizations: [],
      organizationsById: {}
    }
  },
  oneSimpleOrganization: {
    user: {},
    organization: {
      organizations: [simpleOrganization],
      organizationsById: { '1': simpleOrganization }
    }
  },
  complexOrganization: {
    user: {},
    organization: {
      organizations: [complexOrganization],
      organizationsById: { '2': complexOrganization }
    }
  },
  twoOrganizations: {
    user: {},
    organization: {
      organizations: [simpleOrganization, complexOrganization],
      organizationsById: { '1': simpleOrganization, '2': complexOrganization }
    }
  }
}
