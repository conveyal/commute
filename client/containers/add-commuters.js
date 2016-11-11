import {connect} from 'react-redux'

import {appendToGroup, createGroup} from '../actions/group'
import AddCommuters from '../components/add-commuters'

function mapStateToProps (state, props) {
  const {organization} = state
  const {params} = props
  const currentOrganizationId = params.organizationId
  const output = {
    organizationId: currentOrganizationId
  }
  if (params && params.groupId) {
    const currentOrganization = organization.organizationsById[currentOrganizationId]
    const currentGroup = currentOrganization.groupsById[params.groupId]
    Object.assign(output, {
      appendMode: true,
      organizationId: currentOrganizationId,
      group: currentGroup
    })
  }
  return output
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (group, organizationId) =>
      dispatch(createGroup(group, organizationId)),
    append: (commuters, groupId, organizationId) =>
      dispatch(appendToGroup(commuters, groupId, organizationId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCommuters)
