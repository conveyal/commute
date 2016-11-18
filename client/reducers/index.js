import {handleActions} from 'redux-actions'

import * as agency from './agency'
import * as analysis from './analysis'
import * as commuter from './commuter'
import * as group from './group'
import * as organization from './organization'
import * as site from './site'
import * as user from './user'

export default {
  agency: handleActions(agency.reducers, agency.initialState),
  analysis: handleActions(analysis.reducers, analysis.initialState),
  commuter: handleActions(commuter.reducers, commuter.initialState),
  group: handleActions(group.reducers, group.initialState),
  organization: handleActions(organization.reducers, organization.initialState),
  site: handleActions(site.reducers, site.initialState),
  user: handleActions(user.reducers, user.initialState)
}
