import {arrayToObj} from '../utils/reducers'

export const reducers = {
  'set organizations' (state, action) {
    const organizations = [...state.organizations, action.payload]
    return {
      ...state,
      organizations,
      organizationsById: arrayToObj(organizations)
    }
  }
}

export const initialState = {
  currentOrganization: null,
  organizations: [],
  organizationsById: {}
}
