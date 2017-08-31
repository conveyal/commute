import {connect} from 'react-redux'

import commuterActions from '../actions/commuter'
import multiSiteActions from '../actions/multi-site'
import siteActions from '../actions/site'
import Site from '../components/site'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {commuter: commuterStore, multiSite: multiSiteStore, site: siteStore} = state
  const {params} = props
  let commuters = []
  let sites = []
  const multiSite = multiSiteStore[params.multiSiteId]
  if (multiSite) {
    sites = entityIdArrayToEntityArray(multiSite.sites, siteStore)
    sites.forEach((site) => {
      commuters = commuters.concat(entityIdArrayToEntityArray(site.commuters, commuterStore))
    })
  }
  return {
    commuters,
    isMultiSite: true,
    multiSite,
    sites,
    siteStore
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    deleteMainEntity: (opts) => dispatch(multiSiteActions.delete(opts)),
    loadCommuters: (opts) => dispatch(commuterActions.loadMany(opts)),
    loadMultiSite: (opts) => dispatch(multiSiteActions.loadOne(opts)),
    loadSites: (opts) => dispatch(siteActions.loadMany(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Site)
