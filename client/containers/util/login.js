import {setAuth0User} from '@conveyal/woonerf/actions/user'
import {connect} from 'react-redux'

import Login from '../../components/util/login'

function mapStateToProps (state, props) {
  return {}
}

const mapDispatchToProps = {
  setAuth0User
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
