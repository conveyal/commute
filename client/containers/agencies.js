import {connect} from 'react-redux'

import {deleteAgency} from '../actions/agency'
import agencies from '../components/agencies'

function mapStateToProps (state) {
  return {
    agencies: state.agency.agencies
  }
}

function mapDispatchToProps (dispatch) {
  return {
    deleteAgency: (id) => dispatch(deleteAgency(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(agencies)
