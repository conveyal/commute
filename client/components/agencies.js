import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Link} from 'react-router'

import ButtonLink from './button-link'
import Icon from './icon'
import {messages} from '../utils/env'
import {arrayCountRenderer} from '../utils/table'
import {actUponConfirmation} from '../utils/ui'

export default class Agencies extends Component {
  static propTypes = {
    // dispatch
    deleteAgency: PropTypes.func.isRequired,
    loadAgencies: PropTypes.func.isRequired,

    // props
    agencies: PropTypes.array.isRequired
  }

  componentWillMount () {
    this.props.loadAgencies()
  }

  _onDeleteAgencyClick (agency) {
    const doDelete = () => { this.props.deleteAgency(agency) }
    actUponConfirmation(messages.agency.deleteConfirmation, doDelete)
  }

  _toolsRenderer = (cell, row) => {
    return <ButtonGroup>
      <ButtonLink
        bsStyle='warning'
        to={`/agency/${row._id}/edit`}
        >
        Edit
      </ButtonLink>
      <Button bsStyle='danger' onClick={this._onDeleteAgencyClick.bind(this, row)}>Delete</Button>
    </ButtonGroup>
  }

  render () {
    const {agencies} = this.props
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h2>Agencies
              <ButtonLink
                className='pull-right'
                to='/agency/create'
                >
                <span>Create a new agency</span>
                <Icon type='flag' />
              </ButtonLink>
            </h2>
            <p>An agency is a collection of organizations <Icon type='shield' />.</p>
            <BootstrapTable data={agencies}>
              <TableHeaderColumn dataField='_id' isKey hidden />
              <TableHeaderColumn dataField='name' dataFormat={nameRenderer}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='organizations' dataFormat={arrayCountRenderer}>Organizations</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._toolsRenderer}>Tools</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Grid>
    )
  }
}

function nameRenderer (cell, row) {
  return <Link to={`/agency/${row._id}`}>{cell}</Link>
}
