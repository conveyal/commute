import Auth0 from 'mastarm/react/auth0'
import React from 'react'
import {
  IndexRoute,
  Router,
  Route
} from 'react-router'

import Application from './containers/application'
import CreateGroup from './containers/create-group'
import CreateOrganization from './containers/create-organization'
import CreateSite from './containers/create-site'
import CreateSiteAnalysis from './containers/create-site-analysis'
import EditOrganization from './containers/edit-organization'
import EditGroup from './containers/edit-group'
import EditSite from './containers/edit-site'
import Group from './containers/group'
import Organization from './containers/organization'
import Organizations from './containers/organizations'
import Site from './containers/site'
import SiteAnalysis from './containers/site-analysis'

const ApplicationRouter = ({history}) => (
  <Router history={history}>
    <Route path='/' component={Application}>
      <IndexRoute component={Organizations} />
      <Route path='/organizations/create' component={CreateOrganization} />
      <Route path='/organizations/:organizationId' component={Organization}>
        <Route path='edit' component={EditOrganization} />
        <Route path='sites/create' component={CreateSite} />
        <Route path='sites/:siteId' component={Site}>
          <Route path='edit' component={EditSite} />
          <Route path='analysis/create' component={CreateSiteAnalysis} />
          <Route path='analysis/:analysisId' component={SiteAnalysis} />
        </Route>
        <Route path='groups/create' component={CreateGroup} />
        <Route path='groups/:groupId' component={Group}>
          <Route path='edit' component={EditGroup} />
        </Route>
      </Route>
    </Route>
    <Route path='/login' component={Auth0} />
  </Router>
)

export default ApplicationRouter
