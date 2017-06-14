import {connect} from 'react-redux'

import commuterActions from '../actions/commuter'
import multiSiteActions from '../actions/multi-site'
import polygonActions from '../actions/polygon'
import siteActions from '../actions/site'
import SiteReport from '../components/site-report'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {commuter: commuterStore, polygon: polygonStore, site: siteStore} = state
  const {params} = props
  const site = siteStore[params.siteId]
  return {
    commuters: entityIdArrayToEntityArray(site.commuters, commuterStore),
    isMultiSite: false,
    multiSites: Object.values(state.multiSite),
    polygonStore,
    site
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    deleteCommuter: (opts) => dispatch(commuterActions.delete(opts)),
    deleteMainEntity: (opts) => dispatch(siteActions.delete(opts)),
    deletePolygons: (opts) => dispatch(polygonActions.deleteMany(opts)),
    deleteSiteFromMultiSites: (opts) => dispatch(multiSiteActions.deleteSiteFromMultiSites(opts)),
    loadCommuters: (opts) => dispatch(commuterActions.loadMany(opts)),
    loadPolygons: (opts) => dispatch(polygonActions.loadMany(opts)),
    loadSite: (opts) => dispatch(siteActions.loadOne(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteReport)
