import {connect} from 'react-redux'

import {create} from '../actions/organization'
import CreateOrganization from '../components/create-organization'

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts) => dispatch(create(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrganization)
