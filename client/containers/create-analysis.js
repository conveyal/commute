import {connect} from 'react-redux'

import {create as createAnalysis} from '../actions/analysis'
import CreateAnalysis from '../components/create-analysis'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {group, organization, site} = state
  const organizationId = props.params.organizationId
  const currentOrganization = organization[organizationId]
  return {
    groups: entityIdArrayToEntityArray(currentOrganization.groups, group),
    groupsById: group,
    organizationId,
    sites: entityIdArrayToEntityArray(currentOrganization.sites, site)
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts) => dispatch(createAnalysis(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAnalysis)
