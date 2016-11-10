import {connect} from 'react-redux'

import {deleteAnalysis} from '../actions/analysis'
import _histogram from '../components/analysis/histogram'
import _individuals from '../components/analysis/individuals'
import _possibilities from '../components/analysis/possibilities'
import _summary from '../components/analysis/summary'

function mapStateToProps (state, props) {
  const {organization} = state
  const {params} = props
  const currentOrganizationId = params.organizationId
  const currentOrganization = organization.organizationsById[currentOrganizationId]
  const curAnalysis = currentOrganization.analysesById[params.analysisId]
  const commuterGroup = currentOrganization.groupsById[curAnalysis.groupId]
  return {
    analysis: curAnalysis,
    commutersById: commuterGroup.commutersById,
    groupName: commuterGroup.name,
    organizationId: currentOrganizationId,
    siteName: currentOrganization.sitesById[curAnalysis.siteId].name
  }
}

function mapDispatchToProps (dispatch) {
  return {
    deleteAnalysis: (id, organizationId) => dispatch(deleteAnalysis(id, organizationId))
  }
}

export const Histogram = connect(mapStateToProps)(_histogram)
export const Individuals = connect(mapStateToProps)(_individuals)
export const Possibilities = connect(mapStateToProps)(_possibilities)
export const Summary = connect(mapStateToProps, mapDispatchToProps)(_summary)
