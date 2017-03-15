import {connect} from 'react-redux'

import commuterActions from '../actions/commuter'
import multiSiteActions from '../actions/multi-site'
import Site from '../components/site'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {commuter: commuterStore, multiSite: multiSiteStore, site: siteStore} = state
  const {params} = props
  const multiSite = multiSiteStore[params.multiSiteId]
  const sites = entityIdArrayToEntityArray(multiSite.sites, siteStore)
  let commuters = []
  sites.forEach((site) => {
    commuters = commuters.concat(entityIdArrayToEntityArray(site.commuters, commuterStore))
  })
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
    loadMainEntity: (opts) => dispatch(multiSiteActions.loadOne(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Site)
