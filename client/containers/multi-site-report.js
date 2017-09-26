import {connect} from 'react-redux'

import commuterActions from '../actions/commuter'
import multiSiteActions from '../actions/multi-site'
import polygonActions from '../actions/polygon'
import siteActions from '../actions/site'
import makeDataDependentComponent from '../components/util/data-dependent-component'
import SiteReport from '../components/report'
import * as multiSiteDataHandler from '../utils/data-handlers/multi-site'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {commuter: commuterStore, multiSite: multiSiteStore, site: siteStore} = state
  const {params} = props
  let commuters = []
  let numCommuters = 0
  let sites = []
  const multiSite = multiSiteStore[params.multiSiteId]
  if (multiSite) {
    sites = entityIdArrayToEntityArray(multiSite.sites, siteStore)
    sites.forEach((site) => {
      numCommuters += site.commuters.length
      commuters = commuters.concat(entityIdArrayToEntityArray(site.commuters, commuterStore))
    })
  }
  return {
    commuters,
    isMultiSite: true,
    lastCommuterStoreUpdateTime: commuterStore._lastUpdate,
    multiSite,
    numCommuters,
    sites,
    siteStore
  }
}

const mapDispatchToProps = {
  loadCommuters: commuterActions.loadMany,
  loadPolygons: polygonActions.loadMany,
  loadMultiSite: multiSiteActions.loadOne,
  loadSites: siteActions.loadMany
}

export default connect(mapStateToProps, mapDispatchToProps)(
  makeDataDependentComponent(multiSiteDataHandler, SiteReport)
)
