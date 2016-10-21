import {connect} from 'react-redux'

import {login, logout} from '../actions/user'
import Navigation from '../components/navigation'

function mapStateToProps (state) {
  const {user} = state
  return {
    userIsLoggedIn: !!(user && user.profile && user.idToken),
    username: user.profile && user.profile.name
  }
}

function mapDispatchToProps (dispatch) {
  return {
    login,
    logout
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
