import {connect} from 'react-redux'

import commuterActions from '../actions/commuter'
import polygonActions from '../actions/polygon'
import siteActions from '../actions/site'
import makeDataDependentComponent from '../components/util/data-dependent-component'
import SiteReport from '../components/report'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {commuter: commuterStore, polygon: polygonStore, site: siteStore} = state
  const {params} = props
  const site = siteStore[params.siteId]
  return {
    commuters: site ? entityIdArrayToEntityArray(site.commuters, commuterStore) : [],
    isMultiSite: false,
    lastCommuterStoreUpdateTime: commuterStore._lastUpdate,
    numCommuters: site ? site.commuters.length : 0,
    polygonStore,
    site
  }
}

const mapDispatchToProps = {
  loadCommuters: commuterActions.loadMany,
  loadPolygons: polygonActions.loadMany,
  loadSite: siteActions.loadOne
}

export default connect(mapStateToProps, mapDispatchToProps)(
  makeDataDependentComponent('site', SiteReport)
)
