import {connect} from 'react-redux'

import siteActions from '../actions/site'
import SiteCreateReport from '../components/site-create-report'

function mapStateToProps (state, props) {
  const {site: siteStore} = state
  const {params} = props
  const site = siteStore[params.siteId]

  return {
    site
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    updateSite: (opts) => dispatch(siteActions.update(opts, 'none'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SiteCreateReport)
