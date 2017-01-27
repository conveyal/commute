import {connect} from 'react-redux'
import {refreshUser} from '@conveyal/woonerf/auth0'

import Application from '../components/application'

function mapStateToProps (state) {
  return {
    ...state,
    userIsLoggedIn: !!state.user.profile
  }
}

function mapDispatchToProps (dispatch) {
  return {
    refreshUserToken: () => refreshUser(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Application)
