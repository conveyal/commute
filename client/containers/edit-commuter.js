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
    create: (opts) => dispatch(createCommuter(opts)),
    delete: (opts) => dispatch(deleteCommuter(opts)),
    update: (opts) => dispatch(updateCommuter(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCommuter)
