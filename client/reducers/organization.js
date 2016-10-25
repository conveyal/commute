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
  'set organizations' (state, action) {
    const organizations = [...state.organizations, action.payload]
    return {
      ...state,
      organizations,
      organizationsById: arrayToObj(action.payload)
    }
  },
  'add site' (state, action) {
    const site = action.payload
    const affectedOrganization = state.organizationsById[site.organizationId]
    affectedOrganization.sites = [...affectedOrganization.sites, site]
    return {
      ...state
    }
  }
}

export const initialState = {
  organizations: [],
  organizationsById: {}
}
