import {connect} from 'react-redux'

import EditSite from '../components/edit-site'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(EditSite)
