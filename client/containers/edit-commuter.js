import {connect} from 'react-redux'

import {createCommuter, deleteCommuter, updateCommuter} from '../actions/commuter'
import EditCommuter from '../components/edit-commuter'

function mapStateToProps (state, props) {
  const {organization} = state
  const {params} = props
  const currentOrganizationId = params.organizationId
  const output = {
    groupId: params.groupId,
    organizationId: currentOrganizationId
  }
  if (params && params.commuterId) {
    const currentOrganization = organization.organizationsById[currentOrganizationId]
    const currentGroup = currentOrganization.groupsById[params.groupId]
    Object.assign(output, {
      editMode: true,
      commuter: currentGroup.commutersById[params.commuterId]
    })
  }
  return output
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts) => dispatch(createCommuter(opts)),
    delete: (opts) => dispatch(deleteCommuter(opts)),
    update: (opts) => dispatch(updateCommuter(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCommuter)
