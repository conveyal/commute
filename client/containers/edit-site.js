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
    create: (opts) => dispatch(createSite(opts)),
    delete: (opts) => dispatch(deleteSite(opts)),
    update: (opts) => dispatch(updateSite(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSite)
