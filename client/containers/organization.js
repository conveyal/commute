import {connect} from 'react-redux'

import Organization from '../components/organization'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(Organization)
