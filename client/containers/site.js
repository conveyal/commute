import {connect} from 'react-redux'

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
    deleteSite: (opts) => dispatch(siteActions.delete(opts)),
    loadSite: (opts) => dispatch(siteActions.loadOne(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Site)
