import {connect} from 'react-redux'

import CreateGroup from '../components/create-group'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(CreateGroup)
