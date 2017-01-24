import {connect} from 'react-redux'

import commuterActions from '../actions/commuter'
import EditCommuter from '../components/edit-commuter'

function mapStateToProps (state, props) {
  const {commuter: commuterStore} = state
  const {commuterId, siteId} = props.params
  if (commuterId) {
    const currentCommuter = commuterStore[commuterId]
    return {
      editMode: true,
      siteId: currentCommuter.siteId,
      commuter: currentCommuter
    }
  } else if (siteId) {
    return {
      editMode: false,
      siteId
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
