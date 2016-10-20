import {connect} from 'react-redux'

import CreateSiteAnalysis from '../components/create-site-analysis'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(CreateSiteAnalysis)
