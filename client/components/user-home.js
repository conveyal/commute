import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Link} from 'react-router'

import ButtonLink from './button-link'
import Icon from './icon'
import {messages} from '../utils/env'
import {arrayCountRenderer} from '../utils/table'
import {actUponConfirmation} from '../utils/ui'

export default class UserHome extends Component {
  static propTypes = {
    // dispatch
    deleteMultiSite: PropTypes.func.isRequired,
    deleteSite: PropTypes.func.isRequired,
    loadMultiSites: PropTypes.func.isRequired,
    loadSites: PropTypes.func.isRequired,

    // props
    multiSites: PropTypes.array.isRequired,
    sites: PropTypes.array.isRequired
  }

  componentWillMount () {
    this.props.loadSites()
    this.props.loadMultiSites()
  }

  _onDeleteMultiSiteClick (multiSite) {
    const doDelete = () => { this.props.deleteMultiSite(multiSite) }
    actUponConfirmation(messages.multiSite.deleteConfirmation, doDelete)
  }

  _onDeleteSiteClick (site) {
    const doDelete = () => { this.props.deleteSite(site) }
    actUponConfirmation(messages.site.deleteConfirmation, doDelete)
  }

  _multiSiteToolsRenderer = (cell, row) => {
    return <ButtonGroup>
      <Button bsStyle='danger' onClick={this._onDeleteMultiSiteClick.bind(this, row)}>Delete</Button>
    </ButtonGroup>
  }

  _siteToolsRenderer = (cell, row) => {
    return <ButtonGroup>
      <Button bsStyle='danger' onClick={this._onDeleteSiteClick.bind(this, row)}>Delete</Button>
    </ButtonGroup>
  }

  render () {
    const {sites, multiSites} = this.props
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h2>Sites
              <ButtonLink
                className='pull-right'
                to='/site/create'
                >
                <span>Create a new site</span>
                <Icon type='building' />
              </ButtonLink>
            </h2>
            <BootstrapTable data={sites}>
              <TableHeaderColumn dataField='_id' isKey hidden />
              <TableHeaderColumn dataField='name' dataFormat={siteNameRenderer}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
              <TableHeaderColumn dataField='organizations' dataFormat={arrayCountRenderer}># of Commuters</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._siteToolsRenderer}>Tools</TableHeaderColumn>
            </BootstrapTable>
            <h2>Multi-site Analyses
              <ButtonLink
                className='pull-right'
                to='/multi-site/create'
                >
                <span>Create a new Multi-site analysis</span>
                <Icon type='clone' />
              </ButtonLink>
            </h2>
            <BootstrapTable data={multiSites}>
              <TableHeaderColumn dataField='_id' isKey hidden />
              <TableHeaderColumn dataField='name' dataFormat={multiSiteNameRenderer}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='sites' dataFormat={arrayCountRenderer}># of Sites</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._multiSiteToolsRenderer}>Tools</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Grid>
    )
  }
}

function multiSiteNameRenderer (cell, row) {
  return <Link to={`/multi-site/${row._id}`}>{cell}</Link>
}

function siteNameRenderer (cell, row) {
  return <Link to={`/site/${row._id}`}>{cell}</Link>
}
