import multi from '@conveyal/woonerf/store/multi'
import configureStore from 'redux-mock-store'
import promise from 'redux-promise'

// mock store
export const makeMockStore = configureStore([multi, promise])

// mock commuters

// mock commuters for creation purposes
export const commuterSal = {
  _id: 'commuter-3',
  address: '9876 ABC Ct',
  city: 'Megalopolis',
  coordinate: {
    lat: 38.912314,
    lon: -77.033994
  },
  country: 'Made up land',
  county: 'Made up county',
  name: 'Sal A. Mander',
  neighbourhood: undefined,
  state: 'Made up state'
}

// mock existing commuter
export const mockCommuter = {
  _id: 'commuter-2',
  address: '4321 XYZ Boulevard',
  city: 'Megalopolis',
  coordinate: {
    lat: 38.910822,
    lon: -77.041094
  },
  country: 'Made up land',
  county: 'Made up county',
  geocodeConfidence: 0.77,
  siteId: 'site-2',
  name: 'Luke Warm',
  neighbourhood: undefined,
  state: 'Made up state'
}

export const mockSite = {
  _id: 'site-2',
  name: 'Acme Corp',
  address: '123 ABC St',
  city: 'Megalopolis',
  commuters: ['commuter-2'],
  coordinate: {
    lat: 38.892767,
    lon: -77.040740
  },
  country: 'Made up land',
  county: 'Made up county',
  neighbourhood: undefined,
  state: 'Made up state'
}

// mock stores
export const mockStores = {
  init: {
    commuter: {},
    site: {},
    user: {}
  },
  withSite: {
    commuter: {
      'commuter-2': mockCommuter
    },
    site: {
      'site-2': mockSite
    },
    user: {}
  }
}

// utilities
export const mockGeocodeResponse = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [-76.9897, 38.89011]
  },
  properties: {
    id: '4137449',
    gid: 'geonames:venue:4137449',
    layer: 'venue',
    source: 'geonames',
    source_id: '4137449',
    name: 'Abraham Lincoln/Emancipation Monument',
    confidence: 0.904,
    accuracy: 'point',
    country: 'United States',
    country_gid: 'whosonfirst:country:85633793',
    country_a: 'USA',
    region: 'District of Columbia',
    region_gid: 'whosonfirst:region:85688741',
    county: 'District of Columbia',
    county_gid: 'whosonfirst:county:102084889',
    locality: 'Washington',
    locality_gid: 'whosonfirst:locality:85931779',
    neighbourhood: 'Capitol Hill',
    neighbourhood_gid: 'whosonfirst:neighbourhood:85809405',
    label: 'Abraham Lincoln/Emancipation Monument, Washington, USA'
  }
}

export function genGeocodedEntity (additionalFields) {
  return Object.assign(additionalFields, {
    address: 'Abraham Lincoln/Emancipation Monument, Washington, USA',
    city: 'Washington',
    coordinate: {
      lat: 38.89011,
      lon: -76.9897
    },
    country: 'United States',
    county: 'District of Columbia',
    geocodeConfidence: 0.904,
    neighbourhood: undefined,
    state: 'District of Columbia'
  })
}
