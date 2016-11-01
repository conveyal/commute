import {connect} from 'react-redux'

import {createSite, deleteSite, updateSite} from '../actions/site'
import EditSite from '../components/edit-site'

function mapStateToProps (state, props) {
  const {organization} = state
  const {params} = props
  const currentOrganizationId = params.organizationId
  if (params && params.siteId) {
    const currentOrganization = organization.organizationsById[currentOrganizationId]
    const currentSite = currentOrganization.sitesById[params.siteId]
    return {
      editMode: true,
      organizationId: currentOrganizationId,
      site: currentSite
    }
  }
  return {
    organizationId: currentOrganizationId
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
