import {connect} from 'react-redux'

import CreateOrganization from '../components/create-organization'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(CreateOrganization)
