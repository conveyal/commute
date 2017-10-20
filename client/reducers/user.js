
export const reducers = {
  'log out' (state, action) {
    return {}
  },
  'set auth0 user' (state, action) {
    return {
      ...state,
      ...action.payload
    }
  },
  'set id token' (state, action) {
    return {
      ...state,
      idToken: action.payload
    }
  }
}

export const initialState = {
  ...JSON.parse(window.localStorage.getItem('user'))
}
