import {connect} from 'react-redux'

import commuterActions from '../actions/commuter'
import siteActions from '../actions/site'
import Site from '../components/site'

function mapStateToProps (state, props) {
  const {commuter: commuterStore, site: siteStore} = state
  const {params} = props
  const site = siteStore[params.siteId]
  return {
    commuterStore,
    site
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    deleteCommuter: (opts) => dispatch(commuterActions.delete(opts)),
    deleteSite: (opts) => dispatch(siteActions.delete(opts)),
    loadCommuters: (opts) => dispatch(commuterActions.loadMany(opts)),
    loadSite: (opts) => dispatch(siteActions.loadOne(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Site)
