import {connect} from 'react-redux'

import commuterActions from '../actions/commuter'
import polygonActions from '../actions/polygon'
import siteActions from '../actions/site'
import AddCommuters from '../components/add-commuters'
import makeDataDependentComponent from '../components/util/data-dependent-component'
import * as siteDataHandler from '../utils/data-handlers/site'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {commuter: commuterStore, site: siteStore} = state
  const {params} = props
  const site = siteStore[params.siteId]
  return {
    commuters: (site
      ? entityIdArrayToEntityArray(site.commuters, commuterStore)
      : []),
    site
  }
}

const mapDispatchToProps = {
  createCommuters: commuterActions.create,
  loadCommuters: commuterActions.loadMany,
  loadPolygons: polygonActions.loadMany,
  loadSite: siteActions.loadOne
}

export default connect(mapStateToProps, mapDispatchToProps)(
  makeDataDependentComponent(siteDataHandler, AddCommuters)
)
