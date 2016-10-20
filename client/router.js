import Auth0 from 'mastarm/react/auth0'
import React from 'react'
import {
  Router,
  Route
} from 'react-router'

import Application from './containers/application'

const ApplicationRouter = ({history}) => (
  <Router history={history}>
    <Route path='/' component={Application}>
      {/* <IndexRoute component={Organizations} />
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
        <Route path='groups/:groupId' component={Group} />
      </Route> */}
    </Route>
    <Route path='/login' component={Auth0} />
  </Router>
)

export default ApplicationRouter
