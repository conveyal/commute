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
    deleteAnalysis: PropTypes.func.isRequired,
    deleteGroup: PropTypes.func.isRequired,
    deleteOrganization: PropTypes.func.isRequired,
    deleteSite: PropTypes.func.isRequired,
    loadAnalyses: PropTypes.func.isRequired,
    loadGroups: PropTypes.func.isRequired,
    loadSites: PropTypes.func.isRequired,

    // props
    analysis: PropTypes.object.isRequired,
    analyses: PropTypes.array.isRequired,
    group: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
    organization: PropTypes.object.isRequired,
    site: PropTypes.object.isRequired,
    sites: PropTypes.array.isRequired
  }

  componentWillMount () {
    this.props.loadAnalyses({ organizationId: this.props.organization._id })
    this.props.loadGroups({ organizationId: this.props.organization._id })
    this.props.loadSites({ organizationId: this.props.organization._id })
  }

  _analysisGroupNameRenderer = (cell, row) => {
    const group = this.props.group[row.groupId]
    return <Link to={`/group/${group._id}`}>{group.name}</Link>
  }

  _analysisSiteNameRenderer = (cell, row) => {
    const site = this.props.site[row.siteId]
    return <Link to={`/site/${site._id}`}>{site.name}</Link>
  }

  _analysisToolsRenderer = (cell, row) => {
    const doDelete = () => this.props.deleteAnalysis(row)
    const onClick = () => actUponConfirmation(messages.analysis.deleteConfirmation, doDelete)
    return <Button bsStyle='danger' onClick={onClick}>Delete</Button>
  }

  _handleDelete = () => {
    const doDelete = () => this.props.deleteOrganization(this.props.organization)
    actUponConfirmation(messages.organization.deleteConfirmation, doDelete)
  }

  _groupToolsRenderer = (cell, row) => {
    const doDelete = () => this.props.deleteGroup(row)
    const onClick = () => actUponConfirmation(messages.group.deleteConfirmation, doDelete)
    return <Button bsStyle='danger' onClick={onClick}>Delete</Button>
  }

  _siteToolsRenderer = (cell, row) => {
    const doDelete = () => this.props.deleteSite(row)
    const onClick = () => actUponConfirmation(messages.site.deleteConfirmation, doDelete)
    return <div>
      <Button bsStyle='warning'>
        <Link to={`/site/${row._id}/edit`}>Edit</Link>
      </Button>
      <Button bsStyle='danger' onClick={onClick}>Delete</Button>
    </div>
  }

  render () {
    const {analyses, groups, sites} = this.props
    const {_id: organizationId, name} = this.props.organization

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
              <TableHeaderColumn dataField='_id' isKey hidden />
              <TableHeaderColumn dataFormat={makeNameRenderer('site', true)}>Name</TableHeaderColumn>
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
              <TableHeaderColumn dataField='_id' isKey hidden />
              <TableHeaderColumn dataFormat={makeNameRenderer('group')}>Name</TableHeaderColumn>
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
              <TableHeaderColumn dataField='_id' isKey hidden />
              <TableHeaderColumn dataFormat={makeNameRenderer('analysis')}>Name</TableHeaderColumn>
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

function makeNameRenderer (linkBase, linkToEditView) {
  return (cell, row) => {
    return <Link to={`/${linkBase}/${row._id}` + linkToEditView ? '/edit' : ''}>{row.name}</Link>
  }
}
