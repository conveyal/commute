import React from 'react'
import {IndexRoute, Router, Route} from 'react-router'

import AddCommuters from './containers/add-commuters'
import Application from './containers/application'
import EditCommuter from './containers/edit-commuter'
import EditMultiSite from './containers/edit-multi-site'
import EditSite from './containers/edit-site'
import MultiSite from './containers/multi-site'
import MultiSiteCreateReport from './containers/multi-site-create-report'
import MultiSiteReport from './containers/multi-site-report'
import Site from './containers/site'
import SiteCreateReport from './containers/site-create-report'
import SiteReport from './containers/site-report'
import UserHome from './containers/user-home'

const ApplicationRouter = ({history}) => (
  <Router history={history}>
    <Route path='/' component={Application}>
      <IndexRoute component={UserHome} />
      // Site Views
      <Route path='/site/create' component={EditSite} />
      <Route path='/site/:siteId/edit' component={EditSite} />
      <Route path='/site/:siteId' component={Site} />
      <Route path='/site/:siteId/bulk-add-commuters' component={AddCommuters} />
      <Route path='/site/:siteId/commuter/create' component={EditCommuter} />
      <Route path='/site/:siteId/commuter/:commuterId/edit' component={EditCommuter} />
      <Route path='/site/:siteId/create-report' component={SiteCreateReport} />
      <Route path='/site/:siteId/report' component={SiteReport} />

      // Multi-Site Views
      <Route path='/multi-site/create' component={EditMultiSite} />
      <Route path='/multi-site/:multiSiteId/edit' component={EditMultiSite} />
      <Route path='/multi-site/:multiSiteId' component={MultiSite} />
      <Route path='/multi-site/:multiSiteId/create-report' component={MultiSiteCreateReport} />
      <Route path='/multi-site/:multiSiteId/report' component={MultiSiteReport} />
    </Route>
  </Router>
)

export default ApplicationRouter
