import {connect} from 'react-redux'

import {createOrganization as createOrganizationAction} from '../actions/organization'
import EditOrganization from '../components/edit-organization'

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts) => dispatch(createOrganizationAction(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganization)
