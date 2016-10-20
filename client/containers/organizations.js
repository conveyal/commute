import {connect} from 'react-redux'

import Organizations from '../components/organizations'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(Organizations)
