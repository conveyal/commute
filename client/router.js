import Auth0 from '@conveyal/woonerf/components/auth0-lock'
import React from 'react'
import {IndexRoute, Router, Route} from 'react-router'

import AddCommuters from './containers/add-commuters'
import Analysis from './containers/analysis'
import Application from './containers/application'
import CommuterList from './containers/commuter-list'
import EditCommuter from './containers/edit-commuter'
import EditMultiSite from './containers/edit-multi-site'
import EditSite from './containers/edit-site'
import MultiSite from './containers/multi-site'
import Ridematches from './containers/ridematches'
import Site from './containers/site'
import SiteList from './containers/site-list'
import UserHome from './containers/user-home'

const ApplicationRouter = ({history}) => (
  <Router history={history}>
    <Route path='/' component={Application}>
      <IndexRoute component={UserHome} />
      // Site Views
      <Route path='/site/create' component={EditSite} />
      <Route path='/site/:siteId/edit' component={EditSite} />
      <Route path='/site/:siteId' component={Site}>
        <Route path='commuters' component={CommuterList} />
        <Route path='analysis' component={Analysis} />
        <Route path='ridematches' component={Ridematches} />
      </Route>
      <Route path='/site/:siteId/bulk-add-commuters' component={AddCommuters} />
      <Route path='/site/:siteId/commuter/create' component={EditCommuter} />
      <Route path='/site/:siteId/commuter/:commuterId/edit' component={EditCommuter} />

      // Multi-Site Views
      <Route path='/multi-site/create' component={EditMultiSite} />
      <Route path='/multi-site/:multiSiteId/edit' component={EditMultiSite} />
      <Route path='/multi-site/:multiSiteId' component={MultiSite}>
        <Route path='sites' component={SiteList} />
        <Route path='commuters' component={CommuterList} />
        <Route path='analysis' component={Analysis} />
        <Route path='ridematches' component={Ridematches} />
      </Route>
    </Route>
    <Route path='/login' component={Auth0} />
  </Router>
)

export default ApplicationRouter
