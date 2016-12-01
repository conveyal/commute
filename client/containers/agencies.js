import {connect} from 'react-redux'

import agencyActions from '../actions/agency'
import agencies from '../components/agencies'

function mapStateToProps (state) {
  return {
    agencies: Object.values(state.agency)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    deleteAgency: (opts) => dispatch(agencyActions.delete(opts)),
    loadAgencies: () => dispatch(agencyActions.loadAll())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(agencies)
