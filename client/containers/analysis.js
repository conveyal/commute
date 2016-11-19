import {connect} from 'react-redux'

import {deleteAnalysis} from '../actions/analysis'
import _histogram from '../components/analysis/histogram'
import _individuals from '../components/analysis/individuals'
import _possibilities from '../components/analysis/possibilities'
import _summary from '../components/analysis/summary'

function mapStateToProps (state, props) {
  const {analysis, commuter, group, site} = state
  const currentAnalysis = analysis[props.params.analysisId]
  return {
    analysis: currentAnalysis,
    commuterStore: commuter,
    groupName: group[currentAnalysis.groupId].name,
    siteName: site[currentAnalysis.siteId].name
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
