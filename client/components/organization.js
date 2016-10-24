import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Link} from 'react-router'

import Icon from './icon'
import {arrayCountRenderer} from '../utils/table'

export default class Organization extends Component {
  static propTypes = {
    _id: PropTypes.string.isRequired,
    groups: PropTypes.array,
    name: PropTypes.string.isRequired,
    sites: PropTypes.array
  }

  render () {
    const {_id, groups, name, sites} = this.props
    const siteNameRenderer = (cell, row) => {
      return <Link to={`/organizations/${_id}/sites/${row.id}/`}>{row.name}</Link>
    }
    const groupNameRenderer = (cell, row) => {
      return <Link to={`/organizations/${_id}/groups/${row.id}`}>{row.name}</Link>
    }
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h2><Icon type='shield' />{name}</h2>
            <p>Below are this organization's sites and commuter groups.</p>
            <h3>Sites
              <Button className='pull-right'>
                <Link to={`/organizations/${_id}/sites/create`}>Create a new site <Icon type='building' /></Link>
              </Button>
            </h3>
            <p>A site is a location of a building or new address that you want to use as the centerpoint of your commutes.</p>
            <BootstrapTable data={sites}>
              <TableHeaderColumn dataField='id' isKey hidden />
              <TableHeaderColumn dataField='name' dataFormat={siteNameRenderer}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
            </BootstrapTable>
            <h3>Commuter Groups
              <Button className='pull-right'>
                <Link to={`/organizations/${_id}/groups/create`}>Create a new group <Icon type='users' /></Link>
              </Button>
            </h3>
            <p>A commuter group is a list of commuters that can commute to a particular site.</p>
            <BootstrapTable data={groups}>
              <TableHeaderColumn dataField='id' isKey hidden />
              <TableHeaderColumn dataField='name' dataFormat={groupNameRenderer}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='commuters' dataFormat={arrayCountRenderer}>Sites</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Grid>
    )
  }
}
