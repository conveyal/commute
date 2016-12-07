import {connect} from 'react-redux'

import commuterActions from '../actions/commuter'
import groupActions from '../actions/group'
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
    deleteCommuter: (opts) => dispatch(commuterActions.delete(opts)),
    deleteGroup: (opts) => dispatch(groupActions.delete(opts)),
    loadCommuters: (opts) => dispatch(commuterActions.loadMany(opts)),
    update: (opts) => dispatch(groupActions.update(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommuterGroup)
