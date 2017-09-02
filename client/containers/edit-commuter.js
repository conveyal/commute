import {connect} from 'react-redux'

import commuterActions from '../actions/commuter'
import siteActions from '../actions/site'
import makeDataDependentComponent from '../components/util/data-dependent-component'
import EditCommuter from '../components/edit-commuter'

function mapStateToProps (state, props) {
  const {commuter: commuterStore} = state
  const {commuterId, siteId} = props.params
  if (commuterId) {
    return {
      editMode: true,
      siteId,
      commuter: commuterStore[commuterId]
    }
  } else if (siteId) {
    return {
      editMode: false,
      siteId
    }
  }
}

const mapDispatchToProps = {
  createCommuter: commuterActions.create,
  deleteCommuter: commuterActions.delete,
  loadCommuter: commuterActions.loadOne,
  loadSite: siteActions.loadOne,
  updateCommuter: commuterActions.update
}

export default connect(mapStateToProps, mapDispatchToProps)(
  makeDataDependentComponent('commuter', EditCommuter)
)
