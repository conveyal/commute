import {connect} from 'react-redux'

import {deleteAnalysis} from '../actions/analysis'
import {deleteGroup} from '../actions/group'
import {deleteOrganization} from '../actions/organization'
import {deleteSite} from '../actions/site'
import Organization from '../components/organization'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {analysis, group, organization, site} = state
  const currentOrganization = organization[props.params.organizationId]
  return {
    analysis,
    analyses: entityIdArrayToEntityArray(currentOrganization.analyses, analysis),
    group,
    groups: entityIdArrayToEntityArray(currentOrganization.groups, group),
    organization: currentOrganization,
    site,
    sites: entityIdArrayToEntityArray(currentOrganization.sites, site)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    deleteAnalysis: (id, organizationId) => dispatch(deleteAnalysis(id, organizationId)),
    deleteGroup: (id, organizationId) => dispatch(deleteGroup(id, organizationId)),
    deleteOrganization: (id, agencyId) => dispatch(deleteOrganization(id, agencyId)),
    deleteSite: (id, organizationId) => dispatch(deleteSite(id, organizationId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Organization)
