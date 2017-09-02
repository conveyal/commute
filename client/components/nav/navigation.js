import React, {Component, PropTypes} from 'react'
import {Button, Nav, Navbar, NavItem} from 'react-bootstrap'

import Icon from '../util/icon'
import messages from '../../utils/messages'

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
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <div className='logo' />
            <a href='/' className='nav-vertical-center'>Commute Analysis</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Nav pullRight>
          {username &&
            <NavItem eventKey={1}>
              <span className='nav-vertical-center'>
                {`${messages.authentication.username} ${username}`}
              </span>
            </NavItem>
          }
          <NavItem eventKey={2}>
            <Button onClick={logout} bsStyle='warning'>
              <Icon type='sign-out' /> {messages.authentication.logOut}
            </Button>
          </NavItem>
        </Nav>
      </Navbar>
    )
  }
}
