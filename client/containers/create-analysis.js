import {connect} from 'react-redux'

import {createAnalysis} from '../actions/analysis'
import CreateAnalysis from '../components/create-analysis'

function mapStateToProps (state, props) {
  const {organization} = state
  const {params} = props
  const currentOrganizationId = params.organizationId
  const currentOrganization = organization.organizationsById[currentOrganizationId]
  return {
    organization: currentOrganization
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts, organizationId) => dispatch(createAnalysis(opts, organizationId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAnalysis)
