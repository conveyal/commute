import {connect} from 'react-redux'

import {deleteAgency} from '../actions/agency'
import agencies from '../components/agencies'

function mapStateToProps (state) {
  return {
    agencies: Object.values(state.agency)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    deleteAgency: (opts) => dispatch(deleteAgency(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(agencies)
