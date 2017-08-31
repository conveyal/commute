import React, {Component, PropTypes} from 'react'

import BreadcrumbBar from './breadcrumb-bar'
import Login from '../containers/login'
import Navigation from '../containers/navigation'
import Footer from './footer'

export default class Application extends Component {
  static propTypes = {
    // props
    userIsLoggedIn: PropTypes.bool.isRequired
  }

  render () {
    const {children, userIsLoggedIn} = this.props
    const path = process.env.NODE_ENV === 'test' ? window.fakePath : window.location.pathname

    if (userIsLoggedIn) {
      if (path.endsWith('/report')) {
        return (
          <div>
            {children}
          </div>
        )
      } else {
        return (
          <div>
            <Navigation />
            {path !== '/' && <BreadcrumbBar {...this.props} />}
            {children}
            <Footer />
          </div>
        )
      }
    } else {
      return <Login />
    }
  }
}
