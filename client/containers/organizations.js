import {connect} from 'react-redux'

import Organizations from '../components/organizations'

function mapStateToProps (state) {
  return {
    organizations: state.organization.organizations
  }
}

export default connect(mapStateToProps)(Organizations)
