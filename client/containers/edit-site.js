import {connect} from 'react-redux'

import polygonActions from '../actions/polygon'
import siteActions from '../actions/site'
import EditSite from '../components/edit-site'

function mapStateToProps (state, props) {
  const {site: siteStore} = state
  const {siteId} = props.params ? props.params : {}
  if (siteId) {
    const site = siteStore[siteId]
    return {
      editMode: true,
      site
    }
  } else {
    return {
      editMode: false
    }
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts) => dispatch(siteActions.create(opts)),
    deletePolygons: (opts) => dispatch(polygonActions.deleteMany(opts)),
    deleteSite: (opts) => dispatch(siteActions.delete(opts)),
    update: (opts) => dispatch(siteActions.update(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSite)
