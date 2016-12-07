import {connect} from 'react-redux'

import organizationActions from '../actions/organization'
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
    create: (opts) => dispatch(organizationActions.create(opts)),
    delete: (opts) => dispatch(organizationActions.delete(opts)),
    update: (opts) => dispatch(organizationActions.update(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganization)
