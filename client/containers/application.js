import {connect} from 'react-redux'
import {refreshUser} from '@conveyal/woonerf/build/lib/auth0'

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
