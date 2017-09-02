import React, {Component, PropTypes} from 'react'

import Login from '../containers/util/login'
import Navigation from '../containers/nav/navigation'
import BreadcrumbBar from './nav/breadcrumb-bar'
import Footer from './nav/footer'

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
