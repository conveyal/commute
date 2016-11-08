import {connect} from 'react-redux'

import {deleteAnalysis} from '../actions/analysis'
import _summary from '../components/analysis/summary'
import _individuals from '../components/analysis/individuals'
import _possibilities from '../components/analysis/possibilities'
import _timebymode from '../components/analysis/timebymode'

function mapStateToProps (state, props) {
  const {organization} = state
  const {params} = props
  const currentOrganizationId = params.organizationId
  const currentOrganization = organization.organizationsById[currentOrganizationId]
  const curAnalysis = currentOrganization.analysesById[params.analysisId]
  return {
    analysis: curAnalysis,
    groupName: currentOrganization.groupsById[curAnalysis.groupId].name,
    organizationId: currentOrganizationId,
    siteName: currentOrganization.sitesById[curAnalysis.siteId].name
  }
}

function mapDispatchToProps (dispatch) {
  return {
    deleteAnalysis: (id, organizationId) => dispatch(deleteAnalysis(id, organizationId))
  }
}

export const Summary = connect(mapStateToProps, mapDispatchToProps)(_summary)
export const Individuals = connect(mapStateToProps)(_individuals)
export const Possibilities = connect(mapStateToProps)(_possibilities)
export const TimeByMode = connect(mapStateToProps)(_timebymode)
