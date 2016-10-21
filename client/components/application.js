import React, {Component, PropTypes} from 'react'

import Footer from '../components/footer'
import Navigation from '../containers/navigation'

export default class Application extends Component {
  static propTypes = {
    // actions
    refreshUserToken: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.refreshUserToken()
  }

  render () {
    const {children} = this.props
    return (
      <div>
        <Navigation />
        {children}
        <Footer />
      </div>
    )
  }
}
