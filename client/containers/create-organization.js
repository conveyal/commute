import {connect} from 'react-redux'

import {createOrganization as createOrganizationAction} from '../actions/organization'
import CreateOrganization from '../components/create-organization'

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts) => dispatch(createOrganizationAction(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrganization)
