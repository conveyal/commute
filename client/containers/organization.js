import {connect} from 'react-redux'

import Organization from '../components/organization'

function mapStateToProps (state, props) {
  const {organization} = state
  const {id: _id, groups, name, sites} = organization.currentOrganization
  return {_id, groups, name, sites}
}

export default connect(mapStateToProps)(Organization)
