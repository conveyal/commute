import {connect} from 'react-redux'

import multiSiteActions from '../actions/multi-site'
import polygonActions from '../actions/polygon'
import siteActions from '../actions/site'
import UserHome from '../components/user-home'
import {entityMapToEntityArray} from '../utils/entities'

function mapStateToProps (state) {
  return {
    multiSites: entityMapToEntityArray(state.multiSite),
    sites: entityMapToEntityArray(state.site)
  }
}

const mapDispatchToProps = {
  deleteMultiSite: multiSiteActions.delete,
  deleteSiteFromMultiSites: multiSiteActions.deleteSiteFromMultiSites,
  deletePolygons: polygonActions.deleteMany,
  deleteSite: siteActions.delete,
  loadMultiSites: multiSiteActions.loadMany,
  loadSites: siteActions.loadMany
}

export default connect(mapStateToProps, mapDispatchToProps)(UserHome)
