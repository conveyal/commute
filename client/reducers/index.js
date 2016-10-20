import {combineReducers} from 'redux'
import {handleActions} from 'redux-actions'

import * as user from './user'

export default combineReducers({
  user: handleActions(user.reducers, user.initialState)
})
