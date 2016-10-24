import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Link} from 'react-router'

import Icon from './icon'
import {arrayCountRenderer} from '../utils/table'

export default class Organizations extends Component {
  static propTypes = {
    organizations: PropTypes.array
  }

  render () {
    const {organizations} = this.props
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h2>Organizations
              <Button className='pull-right'>
                <Link to='/organizations/create'>Create a new organization <Icon type='shield' /></Link>
              </Button>
            </h2>
            <p>An organization is a collection of sites <Icon type='building' /> and commuters <Icon type='users' />.</p>
            <BootstrapTable data={organizations}>
              <TableHeaderColumn dataField='id' isKey hidden />
              <TableHeaderColumn dataField='name' dataFormat={nameRenderer}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='sites' dataFormat={arrayCountRenderer}>Sites</TableHeaderColumn>
              <TableHeaderColumn dataField='groups' dataFormat={arrayCountRenderer}>Groups</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Grid>
    )
  }
}

const nameRenderer = (cell, row) => {
  return <Link to={`/organizations/${row.id}`}>{cell}</Link>
}
