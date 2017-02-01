import React, {Component, PropTypes} from 'react'

import BreadcrumbBar from '../components/breadcrumb-bar'
import Footer from './footer'
import Navigation from '../containers/navigation'

export default class Application extends Component {
  static propTypes = {
    // actions
    navigateToLogin: PropTypes.func.isRequired,
    // props
    userIsLoggedIn: PropTypes.bool.isRequired
  }

  componentWillMount () {
    const {navigateToLogin, userIsLoggedIn} = this.props
    if (process.env.NODE_ENV !== 'test' && !userIsLoggedIn) {
      navigateToLogin()
    }
  }

  render () {
    const {children, userIsLoggedIn} = this.props
    return userIsLoggedIn
      ? (
        <div>
          <Navigation />
          <BreadcrumbBar
            {...this.props}
            />
          {children}
          <Footer />
        </div>
      )
      : <div />
  }
}
