import {connect} from 'react-redux'
import {goBack} from 'react-router-redux'

import BackButton from '../../components/util/back-button'

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch, props) {
  return {
    goBack: () => dispatch(goBack())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackButton)
