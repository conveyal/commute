import {connect} from 'react-redux'

import Organization from '../components/organization'

function mapStateToProps (state, props) {
  const {organization} = state
  const {params} = props
  const currentOrganization = organization.organizationsById[params.organizationId]
  const {id: _id, groups, name, sites} = currentOrganization
  return {_id, groups, name, sites}
}

export default connect(mapStateToProps)(Organization)
