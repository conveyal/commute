import multi from '@conveyal/woonerf/store/multi'
import configureStore from 'redux-mock-store'
import promise from 'redux-promise'

// mock store
export const makeMockStore = configureStore([multi, promise])

// mock agencies
export const blankAgency = {
  _id: 'agency-1',
  name: 'Mock Agency',
  organizations: []
}

export const agencyWithAnOrganization = {
  _id: 'agency-2',
  name: 'Mock Agency',
  organizations: ['organization-2']
}

// mock entities
export const commuterSal = {
  address: '9876 ABC Ct',
  email: 'sal@a.mander',
  _id: 'commuter-3',
  lat: 38.915,
  lng: -76.971,
  name: 'Sal A. Mander'
}

export const mockCommuter = {
  address: '4321 XYZ Boulevard',
  email: 'luke@warm.cold',
  groupId: 'group-2',
  _id: 'commuter-2',
  lat: 38.916089,
  lng: -76.970221,
  name: 'Luke Warm'
}

export const mockGroup = {
  allAddressesGeocoded: true,
  commuters: ['commuter-2'],
  _id: 'group-2',
  name: 'Mock Group',
  organizationId: 'organization-2'
}

export const mockGroupCreation = {
  commuters: [{
    address: '4321 XYZ Boulevard',
    email: 'luke@warm.cold',
    groupId: 'new-group',
    _id: 'new-commuter',
    name: 'Fake Commuter'
  }],
  _id: 'new-group',
  name: 'Fake Group',
  organizationId: 'organization-1'
}

export const mockSite = {
  _id: 'site-2',
  name: 'Acme Corp',
  address: '123 ABC St',
  lat: 38.8886,
  lng: -77.0430,
  organizationId: 'organization-2',
  radius: 1
}

export const mockTrip = {
  bike: {
    cost: 0.12,
    distance: 23,
    time: 2345,
    polygon: 'encoded'
  },
  car: {
    cost: 6.78,
    distance: 18,
    time: 1234,
    polygon: 'encoded'
  },
  commuterId: 'commuter-2',
  mostLikely: {
    cost: 3.45,
    distance: 30,
    time: 3456,
    mode: 'transit',
    polygon: 'encoded'
  },
  transit: {
    cost: 3.45,
    distance: 30,
    time: 3456,
    polygon: 'encoded'
  },
  walk: {
    cost: 0,
    distance: 19,
    time: 6789,
    polygon: 'encoded'
  }
}

export const mockAnalysis = {
  _id: 'analysis-2',
  groupId: 'group-2',
  lastRunDateTime: 1477697490,
  name: 'An Analysis',
  organizationId: 'organization-2',
  siteId: 'site-2',
  summary: {
    avgTravelTime: 1234,
    avgDistance: 12.34,
    savingsPerTrip: 1.23,
    savingsPerTripYear: 319.8,
    savingsTotalPerDay: 1.23,
    savingsTotalPerYear: 319.8
  },
  trips: [mockTrip],
  tripVals: {
    bike: {
      cost: [0.12],
      distance: [23],
      time: [2345]
    },
    car: {
      cost: [6.78],
      distance: [18],
      time: [1234]
    },
    transit: {
      cost: [3.45],
      distance: [30],
      time: [3456]
    },
    walk: {
      cost: [0],
      distance: [19],
      time: [6789]
    }
  }
}

// mock organizations
export const blankOrganization = {
  agencyId: 'agency-3',
  analyses: [],
  _id: 'organization-1',
  contact: 'someone',
  email: 'abc@def.ghi',
  groups: [],
  logo_url: 'https://placekitten.com/80/80',
  main_url: 'https://placekitten.com/',
  name: 'Mock Organization',
  sites: []
}

export const organizationWithAnAnalysis = {
  agencyId: 'agency-2',
  analyses: ['analysis-2'],
  _id: 'organization-2',
  contact: 'someone',
  email: 'abc@def.ghi',
  groups: ['group-2'],
  logo_url: 'https://placekitten.com/80/80',
  main_url: 'https://placekitten.com/',
  name: 'Mock Organization',
  sites: ['site-2']
}

// mock stores
export const mockStores = {
  init: {
    agency: {},
    analysis: {},
    commuter: {},
    group: {},
    organization: {},
    site: {},
    user: {}
  },
  withAnalysisRun: {
    agency: {
      'agency-2': agencyWithAnOrganization
    },
    analysis: {
      'analysis-2': mockAnalysis
    },
    commuter: {
      'commuter-2': mockCommuter
    },
    group: {
      'group-2': mockGroup
    },
    organization: {
      'organization-2': organizationWithAnAnalysis
    },
    site: {
      'site-2': mockSite
    },
    user: {}
  },
  withBlankAgency: {
    agency: {
      'agency-1': blankAgency
    },
    analysis: {},
    commuter: {},
    group: {},
    organization: {},
    site: {},
    user: {}
  },
  withBlankOrganization: {
    agency: {
      'agency-3': {
        _id: 'agency-3',
        name: 'An agency',
        organizations: ['organization-1']
      }
    },
    analysis: {},
    commuter: {},
    group: {},
    organization: {
      'organization-1': blankOrganization
    },
    site: {},
    user: {}
  }
}
