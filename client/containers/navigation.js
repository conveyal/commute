import {connect} from 'react-redux'

import {logout} from '../actions/user'
import Navigation from '../components/navigation'

function mapStateToProps (state) {
  const {user} = state
  return {
    userIsLoggedIn: !!(user && user.profile && user.idToken),
    username: user && user.profile && user.profile.name
  }
}

function mapDispatchToProps (dispatch) {
  return {
    logout: () => dispatch(logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
