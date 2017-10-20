import {connect} from 'react-redux'

import siteActions from '../actions/site'
import makeDataDependentComponent from '../components/util/data-dependent-component'
import SiteCreateReport from '../components/create-report'
import * as siteDataHandler from '../utils/data-handlers/site'

function mapStateToProps (state, props) {
  const {site: siteStore} = state
  const {params} = props
  const site = siteStore[params.siteId]

  return {
    isMultiSite: false,
    site
  }
}

const mapDispatchToProps = {
  loadSite: siteActions.loadOne,
  update: siteActions.update
}

export default connect(mapStateToProps, mapDispatchToProps)(
  makeDataDependentComponent(siteDataHandler, SiteCreateReport)
)
