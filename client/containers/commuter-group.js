import {connect} from 'react-redux'

import {deleteCommuter} from '../actions/commuter'
import {deleteGroup, updateGroup} from '../actions/group'
import CommuterGroup from '../components/commuter-group'

function mapStateToProps (state, props) {
  const {organization} = state
  const {params} = props
  const currentOrganizationId = params.organizationId
  return {
    organizationId: currentOrganizationId,
    group: organization.organizationsById[currentOrganizationId].groupsById[params.groupId]
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    deleteCommuter: (opts) => dispatch(deleteCommuter(opts)),
    deleteGroup: (groupId, organizationId) => dispatch(deleteGroup(groupId, organizationId)),
    update: (group, organizationId) => dispatch(updateGroup(group, organizationId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommuterGroup)
