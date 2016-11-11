import {handleActions} from 'redux-actions'

import * as organization from './organization'
import * as user from './user'

export default {
  organization: handleActions(organization.reducers, organization.initialState),
  user: handleActions(user.reducers, user.initialState)
}
