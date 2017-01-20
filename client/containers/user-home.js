import {connect} from 'react-redux'

import UserHome from '../components/user-home'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(UserHome)
