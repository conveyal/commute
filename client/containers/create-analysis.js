import {connect} from 'react-redux'

import {createAnalysis} from '../actions/analysis'
import CreateAnalysis from '../components/create-analysis'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {commuter, group, organization, site} = state
  const organizationId = props.params.organizationId
  const currentOrganization = organization[organizationId]
  return {
    commutersById: commuter,
    groups: entityIdArrayToEntityArray(currentOrganization.groups, group),
    organizationId,
    sites: entityIdArrayToEntityArray(currentOrganization.sites, site)
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts, organizationId) => dispatch(createAnalysis(opts, organizationId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAnalysis)
