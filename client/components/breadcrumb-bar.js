import React, {Component, PropTypes} from 'react'
import {Col, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'

export default class BreadcrumbBar extends Component {
  static propTypes = {
    // props
    multiSite: PropTypes.object.isRequired,
    site: PropTypes.object.isRequired
  }

  _makeNavItems () {
    const navItems = [{
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

    const appendMultiSite = (multiSiteId, isActive) => {
      const multiSite = this.props.multiSite[multiSiteId]
      appendEntity(multiSiteId, multiSite ? multiSite.name : '?', '/multi-site/', isActive)
    }

    const appendSite = (siteId, isActive) => {
      const site = this.props.site[siteId]
      appendEntity(siteId, site ? site.name : '?', '/site/', isActive)
    }

    if (path === '/' || path === '/login') {
      // do nothing for home or login
    } else if (path.match(/\/multi-site\/create$/)) {
      // Create Site View
      navItems.push({
        active: true,
        name: 'Create Multi-Site Analysis'
      })
    } else if (path.match(/\/multi-site\/[\w-]+$/)) {
      // Site View
      appendMultiSite(path.match(/\/multi-site\/([\w-]+)/)[1], true)
    } else if (path.match(/\/site\/create$/)) {
      // Create Site View
      navItems.push({
        active: true,
        name: 'Create Site'
      })
    } else if (path.match(/\/site\/[\w-]+$/)) {
      // Site View
      appendSite(path.match(/\/site\/([\w-]+)/)[1], true)
    } else if (path.match(/\/site\/[\w-]+\/bulk-add-commuters$/)) {
      // Create Commuter View
      appendSite(path.match(/\/site\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Bulk Add Commuters'
      })
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
    } else if (path.match(/\/site\/[\w-]+\/edit$/)) {
      // Edit Site View
      appendSite(path.match(/\/site\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Edit Site'
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
