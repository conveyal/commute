import {connect} from 'react-redux'

import commuterActions from '../actions/commuter'
import multiSiteActions from '../actions/multi-site'
import polygonActions from '../actions/polygon'
import siteActions from '../actions/site'
import makeDataDependentComponent from '../components/util/data-dependent-component'
import Site from '../components/site'
import * as siteDataHandler from '../utils/data-handlers/site'
import {
  entityIdArrayToEntityArray,
  entityMapToEntityArray
} from '../utils/entities'

function mapStateToProps (state, props) {
  const {commuter: commuterStore, polygon: polygonStore, site: siteStore} = state
  const {params} = props
  const site = siteStore[params.siteId]
  return {
    commuters: site ? entityIdArrayToEntityArray(site.commuters, commuterStore) : [],
    isMultiSite: false,
    lastCommuterStoreUpdateTime: commuterStore._lastUpdate,
    multiSites: entityMapToEntityArray(state.multiSite),
    numCommuters: site ? site.commuters.length : 0,
    polygonStore,
    site
  }
}

const mapDispatchToProps = {
  deleteCommuter: commuterActions.delete,
  deleteMainEntity: siteActions.delete,
  deletePolygons: polygonActions.deleteMany,
  deleteSiteFromMultiSites: multiSiteActions.deleteSiteFromMultiSites,
  loadCommuters: commuterActions.loadMany,
  loadPolygons: polygonActions.loadMany,
  loadSite: siteActions.loadOne
}

export default connect(mapStateToProps, mapDispatchToProps)(
  makeDataDependentComponent(siteDataHandler, Site)
)
