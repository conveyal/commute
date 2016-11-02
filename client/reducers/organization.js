import {arrayToObj} from '../utils/reducers'

export const reducers = {
  'add organization' (state, action) {
    const organizations = [...state.organizations, action.payload]
    return {
      ...state,
      organizations,
      organizationsById: arrayToObj(organizations)
    }
  },
  'delete organization' (state, action) {
    const organizationsById = state.organizationsById
    delete organizationsById[action.payload]
    const organizations = Object.values(organizationsById)
    return {
      ...state,
      organizations,
      organizationsById
    }
  },
  'set organizations' (state, action) {
    const organizations = [...state.organizations, action.payload]
    return {
      ...state,
      organizations,
      organizationsById: arrayToObj(action.payload)
    }
  },
  'add site' (state, action) {
    const {organizationId, site} = action.payload
    // TODO: figure out if the following lines of code mutate state
    const affectedOrganization = state.organizationsById[organizationId]
    affectedOrganization.sites = [...affectedOrganization.sites, site]
    affectedOrganization.sitesById = arrayToObj(affectedOrganization.sites)
    return {
      ...state
    }
  }
}

export const initialState = {
  organizations: [],
  organizationsById: {}
}
