import {connect} from 'react-redux'

import {deleteOrganization} from '../actions/organization'
import Organizations from '../components/organizations'

function mapStateToProps (state) {
  return {
    organizations: state.organization.organizations
  }
}

function mapDispatchToProps (dispatch) {
  return {
    deleteOrganization: (id) => dispatch(deleteOrganization(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Organizations)
