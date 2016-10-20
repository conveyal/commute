import {connect} from 'react-redux'

import EditOrganization from '../components/edit-organization'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(EditOrganization)
