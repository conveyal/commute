import {connect} from 'react-redux'

import analysisActions from '../actions/analysis'
import commuterActions from '../actions/commuter'
import _histogram from '../components/analysis/histogram'
import _individuals from '../components/analysis/individuals'
import _possibilities from '../components/analysis/possibilities'
import _summary from '../components/analysis/summary'

function mapStateToProps (state, props) {
  const {analysis, commuter, group, site} = state
  const currentAnalysis = analysis[props.params.analysisId]
  const currentGroup = group[currentAnalysis.groupId]
  return {
    analysis: currentAnalysis,
    commuterStore: commuter,
    currentGroup,
    groupName: currentGroup.name,
    site: site[currentAnalysis.siteId]
  }
}

function mapDispatchToProps (dispatch) {
  return {
    calculateRideshares: (opts) => dispatch(analysisActions.calculateRideshares(opts)),
    deleteAnalysis: (opts) => dispatch(analysisActions.delete(opts)),
    loadAnalysis: (opts) => dispatch(analysisActions.loadOne(opts)),
    loadCommuters: (opts) => dispatch(commuterActions.loadMany(opts))
  }
}

export const Histogram = connect(mapStateToProps)(_histogram)
export const Individuals = connect(mapStateToProps, mapDispatchToProps)(_individuals)
export const Possibilities = connect(mapStateToProps)(_possibilities)
export const Summary = connect(mapStateToProps, mapDispatchToProps)(_summary)
