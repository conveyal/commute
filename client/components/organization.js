import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Link} from 'react-router'

import Icon from './icon'
import {messages} from '../utils/env'
import {arrayCountRenderer} from '../utils/table'
import {actUponConfirmation} from '../utils/ui'

export default class Organization extends Component {
  static propTypes = {
    // dispatch
    deleteAnalysis: PropTypes.func,
    deleteGroup: PropTypes.func,
    deleteOrganization: PropTypes.func,
    deleteSite: PropTypes.func,

    // props
    analysis: PropTypes.object.isRequired,
    analyses: PropTypes.array.isRequired,
    group: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
    organization: PropTypes.object.isRequired,
    site: PropTypes.object.isRequired,
    sites: PropTypes.array.isRequired
  }

  _analysisGroupNameRenderer = (cell, row) => {
    const group = this.props.group[row.groupId]
    return <Link to={`/group/${group.id}`}>{group.name}</Link>
  }

  _analysisNameRenderer = (cell, row) => {
    return <Link to={`/analysis/${row.id}`}>{row.name}</Link>
  }

  _analysisSiteNameRenderer = (cell, row) => {
    const site = this.props.site[row.siteId]
    return <Link to={`/group/${site.id}`}>{site.name}</Link>
  }

  _analysisToolsRenderer = (cell, row) => {
    const doDelete = () => {
      this.props.deleteAnalysis({ id: row.id, organizationId: this.props.organization.id })
    }
    const onClick = () => actUponConfirmation(messages.analysis.deleteConfirmation, doDelete)
    return <Button bsStyle='danger' onClick={onClick}>Delete</Button>
  }

  _handleDelete = () => {
    const doDelete = () => this.props.deleteOrganization(this.props.organization)
    actUponConfirmation(messages.organization.deleteConfirmation, doDelete)
  }

  _groupNameRenderer = (cell, row) => {
    return <Link to={`/group/${row.id}/`}>{row.name}</Link>
  }

  _groupToolsRenderer = (cell, row) => {
    const doDelete = () => this.props.deleteGroup({ id: row.id, organizationId: this.props.organization.id })
    const onClick = () => actUponConfirmation(messages.group.deleteConfirmation, doDelete)
    return <Button bsStyle='danger' onClick={onClick}>Delete</Button>
  }

  _siteNameRenderer = (cell, row) => {
    return <Link to={`/site/${row.id}/edit`}>{row.name}</Link>
  }

  _siteToolsRenderer = (cell, row) => {
    const organizationId = this.props.organization.id
    const doDelete = () => this.props.deleteSite({ id: row.id, organizationId })
    const onClick = () => actUponConfirmation(messages.site.deleteConfirmation, doDelete)
    return <div>
      <Button bsStyle='warning'>
        <Link to={`/site/${row.id}/edit`}>Edit</Link>
      </Button>
      <Button bsStyle='danger' onClick={onClick}>Delete</Button>
    </div>
  }

  render () {
    const {analyses, groups, sites} = this.props
    const {id: organizationId, name} = this.props.organization

    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h2><Icon type='shield' />{name}</h2>
            <ButtonGroup>
              <Button bsStyle='warning'>
                <Link to={`/organization/${organizationId}/edit`}>Edit</Link>
              </Button>
              <Button bsStyle='danger' onClick={this._handleDelete}>Delete</Button>
            </ButtonGroup>
            <p>Below are this organization's sites, commuter groups and analyses.</p>
            <h3>Sites
              <Button className='pull-right'>
                <Link to={`/organization/${organizationId}/site/create`}>Create a new site <Icon type='building' /></Link>
              </Button>
            </h3>
            <p>A site is a location of a building or new address that you want to use as the centerpoint of your commutes.</p>
            <BootstrapTable data={sites}>
              <TableHeaderColumn dataField='id' isKey hidden />
              <TableHeaderColumn dataFormat={this._siteNameRenderer}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._siteToolsRenderer}>Tools</TableHeaderColumn>
            </BootstrapTable>
            <h3>Commuter Groups
              <Button className='pull-right'>
                <Link to={`/organization/${organizationId}/group/create`}>Create a new group <Icon type='users' /></Link>
              </Button>
            </h3>
            <p>A commuter group is a list of commuters that can commute to a particular site.</p>
            <BootstrapTable data={groups}>
              <TableHeaderColumn dataField='id' isKey hidden />
              <TableHeaderColumn dataFormat={this._groupNameRenderer}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='commuters' dataFormat={arrayCountRenderer}>Commuters</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._groupToolsRenderer}>Tools</TableHeaderColumn>
            </BootstrapTable>
            <h3>Analyses
              <Button className='pull-right'>
                <Link to={`/organization/${organizationId}/analysis/create`}>Create a new analysis <Icon type='bar-chart' /></Link>
              </Button>
            </h3>
            <p>An analysis calculates commuting statistics for a pairing of a commuter group and site.</p>
            <BootstrapTable data={analyses}>
              <TableHeaderColumn dataField='id' isKey hidden />
              <TableHeaderColumn dataFormat={this._analysisNameRenderer}>Name</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._analysisSiteNameRenderer}>Site</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._analysisGroupNameRenderer}>Group</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._analysisToolsRenderer}>Tools</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Grid>
    )
  }
}
