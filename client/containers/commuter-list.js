import {connect} from 'react-redux'

import CommuterList from '../components/commuter-list'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(CommuterList)
