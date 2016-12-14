import React, {Component, PropTypes} from 'react'
import {Button, Nav, Navbar, NavItem} from 'react-bootstrap'

import {messages} from '../utils/env'

export default class Navigation extends Component {
  static propTypes = {
    // actions
    logout: PropTypes.func.isRequired,

    // state
    userIsLoggedIn: PropTypes.bool.isRequired,
    username: PropTypes.string
  }

  render () {
    const {
      logout,
      username
    } = this.props
    return (
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href='/'>Commute</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {username &&
              <NavItem eventKey={1}>
                {`${messages.authentication.username} ${username}`}
              </NavItem>
            }
            <NavItem eventKey={2}>
              <Button onClick={logout}>{messages.authentication.logOut}</Button>
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
