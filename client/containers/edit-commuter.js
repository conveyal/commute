import {connect} from 'react-redux'

import {createCommuter, deleteCommuter, updateCommuter} from '../actions/commuter'
import EditCommuter from '../components/edit-commuter'

function mapStateToProps (state, props) {
  const {commuter} = state
  const {commuterId, groupId} = props.params
  if (commuterId) {
    const currentCommuter = commuter[commuterId]
    return {
      editMode: true,
      groupId: currentCommuter.groupId,
      commuter: currentCommuter
    }
  } else if (groupId) {
    return {
      editMode: false,
      groupId
    }
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (commuter, groupId) => dispatch(createCommuter(commuter, groupId)),
    delete: (commuterId, groupId) => dispatch(deleteCommuter(commuterId, groupId)),
    update: (commuter, groupId) => dispatch(updateCommuter(commuter, groupId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCommuter)
