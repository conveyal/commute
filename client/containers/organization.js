import {connect} from 'react-redux'

import {deleteAnalysis} from '../actions/analysis'
import {deleteGroup} from '../actions/group'
import {deleteOrganization} from '../actions/organization'
import {deleteSite} from '../actions/site'
import Organization from '../components/organization'

function mapStateToProps (state, props) {
  const {organization} = state
  const {params} = props
  const currentOrganization = organization.organizationsById[params.organizationId]
  return {organization: currentOrganization}
}

function mapDispatchToProps (dispatch) {
  return {
    deleteAnalysis: (id, organizationId) => dispatch(deleteAnalysis(id, organizationId)),
    deleteGroup: (id, organizationId) => dispatch(deleteGroup(id, organizationId)),
    deleteOrganization: (id) => dispatch(deleteOrganization(id)),
    deleteSite: (id, organizationId) => dispatch(deleteSite(id, organizationId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Organization)
