import React, {Component, PropTypes} from 'react'
import {Alert, Grid, Row} from 'react-bootstrap'

import Login from '../containers/util/login'
import Navigation from '../containers/nav/navigation'
import BreadcrumbBar from './nav/breadcrumb-bar'
import Footer from './nav/footer'
import messages from '../utils/messages'

export default class Application extends Component {
  static propTypes = {
    // props
    userIsLoggedIn: PropTypes.bool.isRequired
  }

  render () {
    const {children, userIsAdmin, userIsLoggedIn} = this.props
    const path =
      process.env.NODE_ENV === 'test'
        ? window.fakePath
        : window.location.pathname

    if (userIsLoggedIn || path.indexOf('/public/') === 0) {
      if (path.endsWith('/report')) {
        return <div>{children}</div>
      } else {
        // require admin setting on account to view anything other than public reports
        const isAuthorized = (userIsAdmin || path.indexOf('/public/') === 0)
        return (
          <div>
            <Navigation />
            {isAuthorized && path !== '/' && <BreadcrumbBar {...this.props} />}
            {isAuthorized && children}
            {!isAuthorized &&
              <Grid className='unauthorized'>
                <Row>
                  <Alert bsStyle='danger'>
                    <h4>{messages.authentication.unauthorized.title}</h4>
                    <p>{messages.authentication.unauthorized.body}</p>
                  </Alert>
                </Row>
              </Grid>
            }
            <Footer />
          </div>
        )
      }
    } else {
      return <Login />
    }
  }
}
