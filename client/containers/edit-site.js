import {connect} from 'react-redux'

import multiSiteActions from '../actions/multi-site'
import polygonActions from '../actions/polygon'
import siteActions from '../actions/site'
import makeDataDependentComponent from '../components/data-dependent-component'
import EditSite from '../components/edit-site'

function mapStateToProps (state, props) {
  const {site: siteStore} = state
  const {siteId} = props.params ? props.params : {}
  if (siteId) {
    const site = siteStore[siteId]
    return {
      editMode: true,
      multiSites: Object.values(state.multiSite),
      site
    }
  } else {
    return {
      editMode: false
    }
  }
}

const mapDispatchToProps = {
  create: siteActions.create,
  deletePolygons: polygonActions.deleteMany,
  deleteSite: siteActions.delete,
  deleteSiteFromMultiSites: multiSiteActions.deleteSiteFromMultiSites,
  loadSite: siteActions.loadOne,
  updateSite: siteActions.update
}

export default connect(mapStateToProps, mapDispatchToProps)(
  makeDataDependentComponent('site-only', EditSite)
)
