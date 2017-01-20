import {handleActions} from 'redux-actions'

import * as commuter from './commuter'
import * as site from './site'
import * as user from './user'

export default {
  commuter: handleActions(commuter.reducers, commuter.initialState),
  site: handleActions(site.reducers, site.initialState),
  user: handleActions(user.reducers, user.initialState)
}
