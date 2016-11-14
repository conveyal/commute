import React, {Component, PropTypes} from 'react'

import Footer from './footer'
import Navigation from '../containers/navigation'

export default class Application extends Component {
  static propTypes = {
    // actions
    refreshUserToken: PropTypes.func.isRequired,
    // props
    userIsLoggedIn: PropTypes.bool.isRequired
  }

  componentWillMount () {
    try {
      this.props.refreshUserToken()
    } catch (e) {
      console.error(e)
    }
  }

  render () {
    const {children, userIsLoggedIn} = this.props
    return userIsLoggedIn
      ? (
        <div>
          <Navigation />
          {children}
          <Footer />
        </div>
      )
      : <div />
  }
}
