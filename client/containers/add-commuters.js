import {connect} from 'react-redux'

import {create as createCommuter} from '../actions/commuter'
import AddCommuters from '../components/add-commuters'
import {entityIdArrayToEntityArray} from '../utils/entities'

function mapStateToProps (state, props) {
  const {commuter, group} = state
  const {params} = props
  if (params.organizationId) {
    return {
      appendMode: false,
      organizationId: params.organizationId
    }
  } else if (params.groupId) {
    const affectedGroup = group[params.groupId]
    return {
      appendMode: true,
      existingCommuters: entityIdArrayToEntityArray(affectedGroup.commuters, commuter),
      group: affectedGroup
    }
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    createCommuter: (opts) => dispatch(createCommuter(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCommuters)
