import {connect} from 'react-redux'

import analysisActions from '../actions/analysis'
import groupActions from '../actions/group'
import organizationActions from '../actions/organization'
import siteActions from '../actions/site'
import Organization from '../components/organization'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {analysis, group, organization, site} = state
  const currentOrganization = organization[props.params.organizationId]
  return {
    analysis,
    analyses: entityIdArrayToEntityArray(currentOrganization.analyses, analysis),
    group,
    groups: entityIdArrayToEntityArray(currentOrganization.groups, group),
    organization: currentOrganization,
    site,
    sites: entityIdArrayToEntityArray(currentOrganization.sites, site)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    deleteAnalysis: (opts) => dispatch(analysisActions.delete(opts)),
    deleteGroup: (opts) => dispatch(groupActions.delete(opts)),
    deleteOrganization: (opts) => dispatch(organizationActions.delete(opts)),
    deleteSite: (opts) => dispatch(siteActions.delete(opts)),
    loadAnalyses: (opts) => dispatch(analysisActions.loadMany(opts)),
    loadGroups: (opts) => dispatch(groupActions.loadMany(opts)),
    loadSites: (opts) => dispatch(siteActions.loadMany(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Organization)
