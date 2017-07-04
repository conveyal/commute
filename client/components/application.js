import React, {Component, PropTypes} from 'react'

import BreadcrumbBar from '../components/breadcrumb-bar'
import Navigation from '../containers/navigation'
import Footer from './footer'
import {pageview} from '../utils/analytics'

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
    } else {
      pageview('/')
    }
  }

  render () {
    const {children, userIsLoggedIn} = this.props
    const path = process.env.NODE_ENV === 'test' ? window.fakePath : window.location.pathname

    if (path.endsWith('/report')) {
      return <div>
        {children}
      </div>
    }
    return userIsLoggedIn
      ? (
        <div>
          <Navigation />
          {path !== '/' && <BreadcrumbBar {...this.props} />}
          {children}
          <Footer />
        </div>
      )
      : <div />
  }
}
