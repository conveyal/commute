import {connect} from 'react-redux'

import SiteList from '../components/site-list'

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(SiteList)
