import {connect} from 'react-redux'

import multiSiteActions from '../actions/multi-site'
import siteActions from '../actions/site'
import makeDataDependentComponent from '../components/util/data-dependent-component'
import SiteCreateReport from '../components/create-report'

function mapStateToProps (state, props) {
  const {multiSite: multiSiteStore} = state
  const {params} = props
  const multiSite = multiSiteStore[params.multiSiteId]

  return {
    isMultiSite: true,
    multiSite
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    loadMultiSite: (opts) => dispatch(multiSiteActions.loadOne(opts)),
    loadSites: (opts) => dispatch(siteActions.loadMany(opts)),
    update: (opts) => dispatch(multiSiteActions.update(opts, 'none'))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  makeDataDependentComponent('multi-site-only', SiteCreateReport)
)
