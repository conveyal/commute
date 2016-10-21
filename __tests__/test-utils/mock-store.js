import configureStore from 'redux-mock-store'
import promise from 'redux-promise'

export const makeMockStore = configureStore([promise])

export const mockStoreData = {
  user: {},
  organization: {
    currentOrganization: null,
    organizations: [],
    organizationsById: {}
  }
}
