import {connect} from 'react-redux'

import {deleteCommuter} from '../actions/commuter'
import {deleteGroup, updateGroup} from '../actions/group'
import CommuterGroup from '../components/commuter-group'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {commuter, group} = state
  const {params} = props
  const currentGroup = group[params.groupId]
  return {
    commuters: entityIdArrayToEntityArray(currentGroup.commuters, commuter),
    group: currentGroup
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
