import {connect} from 'react-redux'

import Organization from '../components/organization'

function mapStateToProps (state, props) {
  const {organization} = state
  const {params} = props
  const currentOrganization = organization.organizationsById[params.organizationId]
  return {organization: currentOrganization}
}

export default connect(mapStateToProps)(Organization)
