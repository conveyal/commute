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

const mapDispatchToProps = {
  loadMultiSite: multiSiteActions.loadOne,
  loadSites: siteActions.loadMany,
  update: multiSiteActions.update
}

export default connect(mapStateToProps, mapDispatchToProps)(
  makeDataDependentComponent('multi-site-only', SiteCreateReport)
)
