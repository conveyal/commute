import {connect} from 'react-redux'

import {deleteAgency} from '../actions/agency'
import {deleteOrganization} from '../actions/organization'
import Organizations from '../components/organizations'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {agency, organization} = state
  const currentAgency = agency[props.params.agencyId]
  return {
    agency: currentAgency,
    organizations: entityIdArrayToEntityArray(currentAgency.organizations, organization)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    deleteAgency: (opts) => dispatch(deleteAgency(opts)),
    deleteOrganization: (opts) => dispatch(deleteOrganization(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Organizations)
