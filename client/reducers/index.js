import {handleActions} from 'redux-actions'

import * as user from './user'

const reducers = {
  user: handleActions(user.reducers, user.initialState)
}

export default reducers
