import {connect} from 'react-redux'

import multiSiteActions from '../actions/multi-site'
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

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts) => dispatch(multiSiteActions.create(opts)),
    delete: (opts) => dispatch(multiSiteActions.delete(opts)),
    update: (opts) => dispatch(multiSiteActions.update(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditMultiSite)
