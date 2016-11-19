import {connect} from 'react-redux'

import {createSite, deleteSite, updateSite} from '../actions/site'
import EditSite from '../components/edit-site'

function mapStateToProps (state, props) {
  const {site} = state
  const {organizationId, siteId} = props.params
  if (organizationId) {
    return {
      organizationId,
      editMode: false
    }
  } else if (siteId) {
    const currentSite = site[siteId]
    return {
      editMode: true,
      organizationId: currentSite.organizationId,
      site: currentSite
    }
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts, organizationId) => dispatch(createSite(opts, organizationId)),
    delete: (opts, organizationId) => dispatch(deleteSite(opts, organizationId)),
    update: (opts, organizationId) => dispatch(updateSite(opts, organizationId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSite)
