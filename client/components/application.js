import React, {Component, PropTypes} from 'react'

export default class Application extends Component {
  static propTypes = {
    refreshUserToken: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.refreshUserToken()
  }

  render () {
    const {children} = this.props
    return (
      <div>
        <h1>Hello World</h1>
        {children}
      </div>
    )
  }
}
