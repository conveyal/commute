/* globals FileReader */

import {csvParse} from 'd3-dsv'
import React, {Component, PropTypes} from 'react'
import {Accordion, Button, Col, Grid, Panel, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dropzone from 'react-dropzone'
import {Link} from 'react-router'
import uuid from 'uuid'

import FieldGroup from './fieldgroup'
import Icon from './icon'

export default class AddCommuters extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func,
    append: PropTypes.func,

    // props
    appendMode: PropTypes.bool,
    group: PropTypes.object,
    organizationId: PropTypes.string.isRequired
  }

  componentWillMount () {
    if (this.props.appendMode) {
      this.setState({
        name: this.props.group.name,
        existingCommuters: this.props.group.commuters
      })
    } else {
      this.state = {}
    }
  }

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value })
  }

  handleSubmit = () => {
    const {append, appendMode, create, group, organizationId} = this.props
    if (appendMode) {
      append(this.state.newCommuters, group.id, organizationId)
    } else {
      const newGroup = {...this.state}
      newGroup.commuters = newGroup.newCommuters
      delete newGroup.newCommuters
      create(newGroup, organizationId)
    }
  }

  makeCommuterTable (commuters) {
    return (
      <BootstrapTable data={commuters}>
        <TableHeaderColumn dataField='id' isKey hidden />
        <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
        <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
        <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
      </BootstrapTable>
    )
  }

  onDrop = (files) => {
    const r = new FileReader()

    r.onload = (e) => {
      const newCommuters = csvParse(e.target.result, (row) => {
        const {address, email, name} = row
        const id = row.id || uuid.v4()
        // TODO: parse more field possibilities (first name, last name, etc)
        return {address, email, id, name}
      })

      this.setState({newCommuters})
    }

    // TODO: handle multiple files
    r.readAsText(files[0])
  }

  render () {
    const {appendMode, organizationId} = this.props
    const groupName = this.state.name
    const showAccordion = !!(this.state.existingCommuters || this.state.newCommuters)
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>
              <span>{appendMode ? 'Add Commuters to Group' : 'Create Commuter Group'}</span>
              <Button className='pull-right'>
                <Link to={`/organizations/${organizationId}`}><Icon type='arrow-left' />Back</Link>
              </Button>
            </h3>
            <form>
              <FieldGroup
                label='Name'
                name='name'
                onChange={this.handleChange}
                placeholder='Enter name'
                type='text'
                value={groupName}
                />
              <Dropzone
                accept='text/csv'
                className='dropzone'
                multiple={false}
                onDrop={this.onDrop}
                >
                <div>Try dropping a csv file here, or click to select files to upload.  Make sure the csv file contains the headers: name, email and address.</div>
              </Dropzone>
              {showAccordion &&
                <Accordion>
                  {!!(this.state.existingCommuters) &&
                    <Panel
                      header={`${this.state.existingCommuters.length} Existing Commuters`}
                      bsStyle='info'
                      eventKey='1'
                      >
                      {this.makeCommuterTable(this.state.existingCommuters)}
                    </Panel>
                  }
                  {!!(this.state.newCommuters) &&
                    <Panel
                      header={`${this.state.newCommuters.length} New Commuters`}
                      bsStyle='success'
                      eventKey='2'
                      >
                      {this.makeCommuterTable(this.state.newCommuters)}
                    </Panel>
                  }
                </Accordion>
              }
              <Button
                bsStyle='success'
                onClick={this.handleSubmit}
                >
                {appendMode ? 'Append' : 'Create'}
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>
    )
  }
}
