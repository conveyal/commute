import {connect} from 'react-redux'
import {push} from 'react-router-redux'

import Application from '../components/application'

function mapStateToProps (state) {
  return {
    ...state,
    userIsLoggedIn: !!state.user.profile
  }
}

function mapDispatchToProps (dispatch) {
  return {
    navigateToLogin: () => dispatch(push('/login'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Application)
