import Auth0 from 'mastarm/react/auth0'
import React from 'react'
import {
  IndexRoute,
  Router,
  Route
} from 'react-router'

import AddCommuters from './containers/add-commuters'
import Application from './containers/application'
import CreateAnalysis from './containers/create-analysis'
import EditCommuter from './containers/edit-commuter'
import EditOrganization from './containers/edit-organization'
import EditSite from './containers/edit-site'
import Group from './containers/group'
import Organization from './containers/organization'
import Organizations from './containers/organizations'
import Analysis from './containers/analysis'

const ApplicationRouter = ({history}) => (
  <Router history={history}>
    <Route path='/' component={Application}>
      <IndexRoute component={Organizations} />
      <Route path='/organizations/create' component={EditOrganization} />
      <Route path='/organizations/:organizationId' component={Organization} />
      <Route path='/organizations/:organizationId/edit' component={EditOrganization} />
      <Route path='/organizations/:organizationId/sites/create' component={EditSite} />
      <Route path='/organizations/:organizationId/sites/:siteId/edit' component={EditSite} />
      <Route path='/organizations/:organizationId/groups/create' component={AddCommuters} />
      <Route path='/organizations/:organizationId/groups/:groupId' component={Group} />
      <Route path='/organizations/:organizationId/groups/:groupId/add' component={AddCommuters} />
      <Route path='/organizations/:organizationId/groups/:groupId/edit-commuter' component={EditCommuter} />
      <Route path='/organizations/:organizationId/analysis/create' component={CreateAnalysis} />
      <Route path='/organizations/:organizationId/analysis/:analysisId' component={Analysis} />
    </Route>
    <Route path='/login' component={Auth0} />
  </Router>
)

export default ApplicationRouter
