import multi from 'mastarm/react/store/multi'
import configureStore from 'redux-mock-store'
import promise from 'redux-promise'

// mock store
export const makeMockStore = configureStore([multi, promise])

// mock entities
const mockCommuter = {
  address: '4321 XYZ Boulevard',
  email: 'luke@warm.cold',
  id: '1',
  lat: 38.916089,
  lng: -76.970221,
  name: 'Luke Warm'
}

export const mockGroup = {
  id: '1',
  name: 'Mock Group',
  commuters: [mockCommuter],
  commutersById: { '1': mockCommuter }
}

export const mockSite = {
  id: '1',
  name: 'Acme Corp',
  address: '123 ABC St',
  lat: 38.8886,
  lng: -77.0430,
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
  commuterId: '1',
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
  id: '1',
  groupId: '1',
  lastRunDateTime: 1477697490,
  name: 'An Analysis',
  siteId: '1',
  summary: {
    avgTravelTime: 1234,
    avgDistance: 12.34,
    savingsPerTrip: 1.23,
    savingsPerYear: 12345
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

// mock stores
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
