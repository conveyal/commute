import React, {Component, PropTypes} from 'react'
import {Col, Grid, Row} from 'react-bootstrap'
import {Link} from 'react-router'

export default class BreadcrumbBar extends Component {
  static propTypes = {
    // props
    agency: PropTypes.object.isRequired,
    analysis: PropTypes.object.isRequired,
    commuter: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    organization: PropTypes.object.isRequired,
    site: PropTypes.object.isRequired
  }

  _makeNavItems () {
    let navItems = [{
      href: '/',
      name: 'Agencies'
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

    const appendAgency = (agencyId, isActive) => {
      appendEntity(agencyId, this.props.agency[agencyId].name, '/agency/', isActive)
    }

    const appendOrganization = (organizationId, isActive) => {
      const organization = this.props.organization[organizationId]
      appendAgency(organization.agencyId)
      appendEntity(organizationId, organization.name, '/organization/', isActive)
    }

    const appendAnalysis = (analysisId, isActive) => {
      const analysis = this.props.analysis[analysisId]
      appendOrganization(analysis.organizationId)
      appendEntity(analysisId, analysis.name, '/analysis/', isActive)
    }

    const appendGroup = (groupId, isActive) => {
      const group = this.props.group[groupId]
      appendOrganization(group.organizationId)
      appendEntity(groupId, group.name, '/group/', isActive)
    }

    const appendSite = (siteId, isActive) => {
      const site = this.props.site[siteId]
      appendOrganization(site.organizationId)
      appendEntity(siteId, site.name, '/site/', isActive)
    }

    if (path === '/') {
      // do nothing for home
    } else if (path.match('/agency/create')) {
      // Create agency view
      navItems.push({
        active: true,
        name: 'Create Agency'
      })
    } else if (path.match(/\/agency\/[\w-]+$/)) {
      // Agency (Organizations) view
      appendAgency(path.match(/\/agency\/([\w-]+)/)[1], true)
    } else if (path.match(/\/agency\/[\w-]+\/edit$/)) {
      // Edit Agency View
      appendAgency(path.match(/\/agency\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Edit Agency'
      })
    } else if (path.match(/\/agency\/[\w-]+\/organization\/create$/)) {
      // Create Organization View
      appendAgency(path.match(/\/agency\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Create Organization'
      })
    } else if (path.match(/\/organization\/[\w-]+$/)) {
      // Organization View
      appendOrganization(path.match(/\/organization\/([\w-]+)/)[1], true)
    } else if (path.match(/\/organization\/[\w-]+\/edit$/)) {
      // Edit Organization View
      appendOrganization(path.match(/\/organization\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Edit Organization'
      })
    } else if (path.match(/\/organization\/[\w-]+\/analysis\/create$/)) {
      // Create Analysis View
      appendOrganization(path.match(/\/organization\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Create Analysis'
      })
    } else if (path.match(/\/analysis\/[\w-]+$/)) {
      // Analysis Summary View
      appendAnalysis(path.match(/\/analysis\/([\w-]+)/)[1], true)
    } else if (path.match(/\/analysis\/[\w-]+\/histogram$/)) {
      // Analysis histogram View
      appendAnalysis(path.match(/\/analysis\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Histogram'
      })
    } else if (path.match(/\/analysis\/[\w-]+\/possibilities$/)) {
      // Analysis Possibilities View
      appendAnalysis(path.match(/\/analysis\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Possibilities'
      })
    } else if (path.match(/\/analysis\/[\w-]+\/individuals$/)) {
      // Individual Analysis View
      appendAnalysis(path.match(/\/analysis\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Individuals'
      })
    } else if (path.match(/\/organization\/[\w-]+\/group\/create$/)) {
      // Add Commuter Group View
      appendOrganization(path.match(/\/organization\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Create Group'
      })
    } else if (path.match(/\/group\/[\w-]+$/)) {
      // Group View
      appendGroup(path.match(/\/group\/([\w-]+)/)[1], true)
    } else if (path.match(/\/group\/[\w-]+\/add$/)) {
      // Append Commuters View
      appendGroup(path.match(/\/group\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Add Commuters'
      })
    } else if (path.match(/\/group\/[\w-]+\/commuter\/create$/)) {
      // Create Commuter View
      appendGroup(path.match(/\/group\/([\w-]+)/)[1])
      navItems.push({
        active: true,
        name: 'Create Commuter'
      })
    } else if (path.match(/\/commuter\/[\w-]+\/edit$/)) {
      // Edit Commuter View
      const commuter = this.props.commuter[path.match(/\/commuter\/([\w-]+)/)[1]]
      appendGroup(commuter.groupId)
      navItems.push({
        active: true,
        name: 'Edit Commuter'
      })
    } else if (path.match(/\/organization\/[\w-]+\/site\/create$/)) {
      // Create Site View
      appendOrganization(path.match(/\/organization\/([\w-]+)/)[1])
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
