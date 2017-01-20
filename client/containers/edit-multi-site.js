import {connect} from 'react-redux'

import EditMultiSite from '../components/edit-multi-site'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(EditMultiSite)
