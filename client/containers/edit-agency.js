import {connect} from 'react-redux'

import agencyActions from '../actions/agency'
import EditAgency from '../components/edit-agency'

function mapStateToProps (state, props) {
  const {agency} = state
  const {agencyId} = props.params
  if (agencyId) {
    const currentAgency = agency[agencyId]
    return {
      agency: currentAgency,
      editMode: true
    }
  } else {
    return {
      editMode: false
    }
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts) => dispatch(agencyActions.create(opts)),
    delete: (opts) => dispatch(agencyActions.delete(opts)),
    update: (opts) => dispatch(agencyActions.update(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAgency)
