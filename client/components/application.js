import React, {Component, PropTypes} from 'react'

export default class Application extends Component {
  static propTypes = {
    refreshUserToken: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.refreshUserToken()
  }

  render () {
    return <h1>Hello World</h1>
  }
}
