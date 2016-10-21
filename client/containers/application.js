import {connect} from 'react-redux'
import {refreshUser} from 'mastarm/react/auth0'

import Application from '../components/application'

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return {
    refreshUserToken: () => refreshUser(dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Application)
