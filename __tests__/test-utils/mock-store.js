import multi from 'mastarm/react/store/multi'
import configureStore from 'redux-mock-store'
import promise from 'redux-promise'

export const makeMockStore = configureStore([multi, promise])

export const mockStoreData = {
  user: {},
  organization: {
    currentOrganization: null,
    organizations: [],
    organizationsById: {}
  }
}
