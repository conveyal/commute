import {connect} from 'react-redux'

import multiSiteActions from '../actions/multi-site'
import polygonActions from '../actions/polygon'
import siteActions from '../actions/site'
import UserHome from '../components/user-home'

function mapStateToProps (state) {
  return {
    multiSites: Object.values(state.multiSite),
    sites: Object.values(state.site)
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    deleteMultiSite: (opts) => dispatch(multiSiteActions.delete(opts)),
    deleteSiteFromMultiSites: (opts) => dispatch(multiSiteActions.deleteSiteFromMultiSites(opts)),
    deletePolygons: (opts) => dispatch(polygonActions.deleteMany(opts)),
    deleteSite: (opts) => dispatch(siteActions.delete(opts)),
    loadMultiSites: () => dispatch(multiSiteActions.loadMany()),
    loadSites: () => dispatch(siteActions.loadMany())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserHome)
