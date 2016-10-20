import {connect} from 'react-redux'

import CreateSite from '../components/create-site'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(CreateSite)
