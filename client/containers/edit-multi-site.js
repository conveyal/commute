import {connect} from 'react-redux'

import multiSiteActions from '../actions/multi-site'
import siteActions from '../actions/site'
import makeDataDependentComponent from '../components/util/data-dependent-component'
import EditMultiSite from '../components/edit-multi-site'

function mapStateToProps (state, props) {
  const {multiSite: multiSiteStore, site: siteStore} = state
  const {multiSiteId} = props.params ? props.params : {}
  if (multiSiteId) {
    const multiSite = multiSiteStore[multiSiteId]
    return {
      editMode: true,
      multiSite,
      siteStore
    }
  } else {
    return {
      editMode: false,
      siteStore
    }
  }
}

const mapDispatchToProps = {
  create: multiSiteActions.create,
  delete: multiSiteActions.delete,
  loadMultiSite: multiSiteActions.loadOne,
  loadSites: siteActions.loadMany,
  update: multiSiteActions.update
}

export default connect(mapStateToProps, mapDispatchToProps)(
  makeDataDependentComponent('multi-site-only', EditMultiSite)
)
