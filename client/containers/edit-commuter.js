import {connect} from 'react-redux'

import commuterActions from '../actions/commuter'
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
    create: (opts) => dispatch(commuterActions.create(opts)),
    delete: (opts) => dispatch(commuterActions.delete(opts)),
    update: (opts) => dispatch(commuterActions.update(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCommuter)
