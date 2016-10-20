import {connect} from 'react-redux'

import SiteAnalysis from '../components/site-analysis'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(SiteAnalysis)
