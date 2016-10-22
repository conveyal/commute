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
  }
}

export const initialState = {
  currentOrganization: null,
  organizations: [],
  organizationsById: {}
}
