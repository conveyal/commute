import {connect} from 'react-redux'

import Application from '../components/application'

function mapStateToProps (state) {
  return {
    ...state,
    userIsLoggedIn: !!state.user.profile
  }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Application)
