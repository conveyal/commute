import {connect} from 'react-redux'

import siteActions from '../actions/site'
import makeDataDependentComponent from '../components/util/data-dependent-component'
import SiteCreateReport from '../components/create-report'

function mapStateToProps (state, props) {
  const {site: siteStore} = state
  const {params} = props
  const site = siteStore[params.siteId]

  return {
    isMultiSite: false,
    site
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    loadSite: (opts) => dispatch(siteActions.loadOne(opts)),
    update: (opts) => dispatch(siteActions.update(opts, 'none'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  makeDataDependentComponent('site-only', SiteCreateReport)
)
