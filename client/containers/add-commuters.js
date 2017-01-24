import {connect} from 'react-redux'

import {create as createCommuters} from '../actions/commuter'
import AddCommuters from '../components/add-commuters'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {commuter: commuterStore, site: siteStore} = state
  const {params} = props
  const site = siteStore[params.siteId]
  return {
    existingCommuters: entityIdArrayToEntityArray(site.commuters, commuterStore),
    site
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    createCommuters: (opts) => dispatch(createCommuters(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCommuters)
