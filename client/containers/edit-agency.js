import {connect} from 'react-redux'

import {createAgency, deleteAgency, updateAgency} from '../actions/agency'
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
    create: (opts) => dispatch(createAgency(opts)),
    delete: (opts) => dispatch(deleteAgency(opts)),
    update: (opts) => dispatch(updateAgency(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAgency)
