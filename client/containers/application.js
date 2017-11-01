import {connect} from 'react-redux'

import Application from '../components/application'

function mapStateToProps (state) {
  return {
    userIsAdmin:
      state.user.profile &&
      state.user.profile.app_metadata &&
      state.user.profile.app_metadata.isAdmin,
    userIsLoggedIn: !!state.user.profile
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Application)
