import {connect} from 'react-redux'

import {createOrganization, deleteOrganization, updateOrganization} from '../actions/organization'
import EditOrganization from '../components/edit-organization'

function mapStateToProps (state, props) {
  const {organization} = state
  const {agencyId, organizationId} = props.params
  if (agencyId) {
    return {
      agencyId,
      editMode: false
    }
  } else if (organizationId) {
    const currentOrganization = organization[organizationId]
    return {
      agencyId: currentOrganization.agencyId,
      editMode: true,
      organization: currentOrganization
    }
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts) => dispatch(createOrganization(opts)),
    delete: (opts) => dispatch(deleteOrganization(opts)),
    update: (opts) => dispatch(updateOrganization(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganization)
