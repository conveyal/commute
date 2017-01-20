import {connect} from 'react-redux'

import Ridematches from '../components/ridematches'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(Ridematches)
