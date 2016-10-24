import {connect} from 'react-redux'

import {createSite as createSiteAction} from '../actions/organization'
import CreateSite from '../components/create-site'

function mapStateToProps (state, props) {
  const {params} = props
  return {
    organizationId: params.organizationId
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    create: (opts) => dispatch(createSiteAction(opts))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateSite)
