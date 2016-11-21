import Auth0 from 'mastarm/react/auth0'
import React from 'react'
import {
  IndexRoute,
  Router,
  Route
} from 'react-router'

import Agencies from './containers/agencies'
import AddCommuters from './containers/add-commuters'
import Application from './containers/application'
import CreateAnalysis from './containers/create-analysis'
import EditAgency from './containers/edit-agency'
import EditCommuter from './containers/edit-commuter'
import EditOrganization from './containers/edit-organization'
import EditSite from './containers/edit-site'
import CommuterGroup from './containers/commuter-group'
import Organization from './containers/organization'
import Organizations from './containers/organizations'
import {Summary, Individuals, Possibilities, Histogram} from './containers/analysis'

const ApplicationRouter = ({history}) => (
  <Router history={history}>
    <Route path='/' component={Application}>
      // Agency views
      <IndexRoute component={Agencies} />
      <Route path='/agency/create' component={EditAgency} />
      <Route path='/agency/:agencyId' component={Organizations} />
      <Route path='/agency/:agencyId/edit' component={EditAgency} />
      // Organization Views
      <Route path='/agency/:agencyId/organization/create' component={EditOrganization} />
      <Route path='/organization/:organizationId' component={Organization} />
      <Route path='/organization/:organizationId/edit' component={EditOrganization} />
      // Analysis Views
      <Route path='/organization/:organizationId/analysis/create' component={CreateAnalysis} />
      <Route path='/analysis/:analysisId' component={Summary} />
      <Route path='/analysis/:analysisId/histogram' component={Histogram} />
      <Route path='/analysis/:analysisId/possibilities' component={Possibilities} />
      <Route path='/analysis/:analysisId/individuals' component={Individuals} />
      // Group Views
      <Route path='/organization/:organizationId/group/create' component={AddCommuters} />
      <Route path='/group/:groupId' component={CommuterGroup} />
      <Route path='/group/:groupId/add' component={AddCommuters} />
      // Commuter Views
      <Route path='/group/:groupId/commuter/create' component={EditCommuter} />
      <Route path='/commuter/:commuterId/edit' component={EditCommuter} />
      // Site Views
      <Route path='/organization/:organizationId/site/create' component={EditSite} />
      <Route path='/site/:siteId/edit' component={EditSite} />
    </Route>
    <Route path='/login' component={Auth0} />
  </Router>
)

export default ApplicationRouter
