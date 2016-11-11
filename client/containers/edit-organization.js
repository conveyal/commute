import {connect} from 'react-redux'

import {createOrganization, deleteOrganization, updateOrganization} from '../actions/organization'
import EditOrganization from '../components/edit-organization'

function mapStateToProps (state, props) {
  const {organization} = state
  const {params} = props
  if (params && params.organizationId) {
    const currentOrganization = organization.organizationsById[params.organizationId]
    return {
      editMode: true,
      organization: currentOrganization
    }
  }
  return {}
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts) => dispatch(createOrganization(opts)),
    delete: (opts) => dispatch(deleteOrganization(opts)),
    update: (opts) => dispatch(updateOrganization(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganization)
