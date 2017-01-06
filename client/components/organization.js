import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Link} from 'react-router'

import ButtonLink from './button-link'
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
    return <Button bsStyle='danger' onClick={this._onAnalysisDeleteClick.bind(this, row)}>Delete</Button>
  }

  _handleDelete = () => {
    const doDelete = () => this.props.deleteOrganization(this.props.organization)
    actUponConfirmation(messages.organization.deleteConfirmation, doDelete)
  }

  _groupToolsRenderer = (cell, row) => {
    return <Button bsStyle='danger' onClick={this._onGroupDeleteClick.bind(this, row)}>Delete</Button>
  }

  _onAnalysisDeleteClick (analysis) {
    const doDelete = () => this.props.deleteAnalysis(analysis)
    actUponConfirmation(messages.analysis.deleteConfirmation, doDelete)
  }

  _onGroupDeleteClick (group) {
    const doDelete = () => this.props.deleteGroup(group)
    actUponConfirmation(messages.group.deleteConfirmation, doDelete)
  }

  _onSiteDeleteClick (site) {
    const doDelete = () => this.props.deleteSite(site)
    actUponConfirmation(messages.group.deleteConfirmation, doDelete)
  }

  _siteToolsRenderer = (cell, row) => {
    return <ButtonGroup>
      <ButtonLink
        bsStyle='warning'
        to={`/site/${row._id}/edit`}
        >
        Edit
      </ButtonLink>
      <Button bsStyle='danger' onClick={this._onSiteDeleteClick.bind(this, row)}>Delete</Button>
    </ButtonGroup>
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
              <ButtonLink
                bsStyle='warning'
                to={`/organization/${organizationId}/edit`}
                >
                Edit
              </ButtonLink>
              <Button bsStyle='danger' onClick={this._handleDelete}>Delete</Button>
            </ButtonGroup>
            <p>Below are this organization's sites, commuter groups and analyses.</p>
            <h3>Sites
              <ButtonLink
                className='pull-right'
                to={`/organization/${organizationId}/site/create`}
                >
                <span>Create a new site</span>
                <Icon type='building' />
              </ButtonLink>
            </h3>
            <p>A site is a location of a building or new address that you want to use as the centerpoint of your commutes.</p>
            <BootstrapTable data={sites}>
              <TableHeaderColumn dataField='_id' isKey hidden />
              <TableHeaderColumn dataFormat={makeNameRenderer('site', true)}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._siteToolsRenderer}>Tools</TableHeaderColumn>
            </BootstrapTable>
            <h3>Commuter Groups
              <ButtonLink
                className='pull-right'
                to={`/organization/${organizationId}/group/create`}
                >
                <span>Create a new group</span>
                <Icon type='users' />
              </ButtonLink>
            </h3>
            <p>A commuter group is a list of commuters that can commute to a particular site.</p>
            <BootstrapTable data={groups}>
              <TableHeaderColumn dataField='_id' isKey hidden />
              <TableHeaderColumn dataFormat={makeNameRenderer('group')}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='commuters' dataFormat={arrayCountRenderer}>Commuters</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._groupToolsRenderer}>Tools</TableHeaderColumn>
            </BootstrapTable>
            <h3>Analyses
              <ButtonLink
                className='pull-right'
                to={`/organization/${organizationId}/analysis/create`}
                >
                <span>Create a new analysis</span>
                <Icon type='bar-chart' />
              </ButtonLink>
            </h3>
            <p>An analysis calculates commuting statistics for a pairing of a commuter group and site.</p>
            <BootstrapTable data={analyses}>
              <TableHeaderColumn dataField='_id' isKey hidden />
              <TableHeaderColumn dataFormat={makeNameRenderer('analysis')}>Name</TableHeaderColumn>
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
    return <Link to={`/${linkBase}/${row._id}` + (linkToEditView ? '/edit' : '')}>{row.name}</Link>
  }
}
