import {connect} from 'react-redux'

import agencyActions from '../actions/agency'
import organizationActions from '../actions/organization'
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
    deleteAgency: (opts) => dispatch(agencyActions.delete(opts)),
    deleteOrganization: (opts) => dispatch(organizationActions.delete(opts)),
    loadOrganizations: (opts) => dispatch(organizationActions.loadAll(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Organizations)
