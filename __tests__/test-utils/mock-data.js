import multi from 'mastarm/react/store/multi'
import configureStore from 'redux-mock-store'
import promise from 'redux-promise'

export const makeMockStore = configureStore([multi, promise])

export const simpleOrganization = {
  id: '1',
  contact: 'someone',
  email: 'abc@def.ghi',
  groups: [],
  logo_url: 'https://placekitten.com/80/80',
  main_url: 'https://placekitten.com/',
  name: 'Mock Organization',
  sites: []
}

export const mockSite = { id: '1', name: 'Acme Corp', address: '123 ABC St' }

export const complexOrganization = {
  id: '2',
  contact: 'someone',
  email: 'abc@def.ghi',
  groups: [{ id: '1', name: 'Mock Group', commuters: [] }],
  logo_url: 'https://placekitten.com/80/80',
  main_url: 'https://placekitten.com/',
  name: 'Mock Organization',
  sites: [mockSite]
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
      organizationsById: { '1': complexOrganization }
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
