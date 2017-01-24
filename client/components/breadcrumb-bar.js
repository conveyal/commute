import React, {Component, PropTypes} from 'react'
import {Col, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'

export default class BreadcrumbBar extends Component {
  static propTypes = {
    // props
    commuter: PropTypes.object.isRequired,
    site: PropTypes.object.isRequired
  }

  _makeNavItems () {
    let navItems = [{
      href: '/',
      name: 'Home'
    }]

    const path = process.env.NODE_ENV === 'test' ? window.fakePath : window.location.pathname

    const appendEntity = (id, name, urlBase, isActive) => {
      if (isActive) {
        navItems.push({
          active: true,
          name
        })
      } else {
        navItems.push({
          href: urlBase + id,
          name
        })
      }
    }

    const appendSite = (siteId, isActive) => {
      const site = this.props.site[siteId]
      appendEntity(siteId, site ? site.name : '?', '/site/', isActive)
    }

    if (path === '/' || path === '/login') {
      // do nothing for home or login
    } else if (path.match(/\/site\/create$/)) {
      // Create Site View
      navItems.push({
        active: true,
        name: 'Create Site'
      })
    } else if (path.match(/\/site\/[\w-]+\/edit$/)) {
      // Edit Site View
      appendSite(path.match(/\/site\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Edit Site'
      })
    } else if (path.match(/\/site\/[\w-]+$/)) {
      // Edit Site View
      appendSite(path.match(/\/site\/([\w-]+)/)[1], true)
    } else if (path.match(/\/site\/[\w-]+\/commuter\/create$/)) {
      // Create Commuter View
      appendSite(path.match(/\/site\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Create New Commuter'
      })
    } else if (path.match(/\/site\/[\w-]+\/commuter\/[\w-]+\/edit$/)) {
      // Create Commuter View
      appendSite(path.match(/\/site\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Edit Commuter'
      })
    } else {
      console.error(`Path not matched for breadcrumb generation: ${path}`)
    }
    return navItems
  }

  render () {
    const navItems = this._makeNavItems()
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <ol role='navigation' aria-label='breadcrumbs' className='breadcrumb'>
              {navItems.map((item, idx) => {
                return (
                  <li
                    key={idx}
                    >
                    {item.active ? item.name : <Link to={item.href}>{item.name}</Link>}
                  </li>
                )
              })}
            </ol>
          </Col>
        </Row>
      </Grid>
    )
  }
}
