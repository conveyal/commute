import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Link} from 'react-router'

import Icon from './icon'
import {messages} from '../utils/env'
import {arrayCountRenderer} from '../utils/table'
import {actUponConfirmation} from '../utils/ui'

export default class Agencies extends Component {
  static propTypes = {
    // dispatch
    deleteAgency: PropTypes.func,

    // props
    agencies: PropTypes.array
  }

  _toolsRenderer = (cell, row) => {
    const doDelete = () => { this.props.deleteAgency(row.id) }
    const onClick = () => actUponConfirmation(messages.agency.deleteConfirmation, doDelete)
    return <div>
      <Button bsStyle='warning'>
        <Link to={`/agency/${row.id}/edit`}>Edit</Link>
      </Button>
      <Button bsStyle='danger' onClick={onClick}>Delete</Button>
    </div>
  }

  render () {
    const {agencies} = this.props
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h2>Agencies
              <Button className='pull-right'>
                <Link to='/agency/create'>Create a new agency <Icon type='flag' /></Link>
              </Button>
            </h2>
            <p>An agency is a collection of organizations <Icon type='shield' />.</p>
            <BootstrapTable data={agencies}>
              <TableHeaderColumn dataField='id' isKey hidden />
              <TableHeaderColumn dataField='name' dataFormat={nameRenderer}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='organizations' dataFormat={arrayCountRenderer}>Sites</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._toolsRenderer}>Tools</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Grid>
    )
  }
}

const nameRenderer = (cell, row) => {
  return <Link to={`/agency/${row.id}`}>{cell}</Link>
}
