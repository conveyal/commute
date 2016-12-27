/* globals FileReader */

import {csvParse} from 'd3-dsv'
import omit from 'lodash.omit'
import React, {Component, PropTypes} from 'react'
import {Accordion, Col, Grid, Panel, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dropzone from 'react-dropzone'
import Form from 'react-formal'
import uuid from 'uuid'
import yup from 'yup'

import ButtonLink from './button-link'
import FormalFieldGroup from './formal-fieldgroup'
import Icon from './icon'

const groupSchema = yup.object({
  name: yup.string().label('Group Name').required()
})

export default class AddCommuters extends Component {
  static propTypes = {
    // dispatch
    createCommuter: PropTypes.func.isRequired,
    createGroup: PropTypes.func.isRequired,

    // props
    appendMode: PropTypes.bool,
    existingCommuters: PropTypes.array,
    group: PropTypes.object,
    organizationId: PropTypes.string
  }

  componentWillMount () {
    if (this.props.appendMode) {
      this.state = {
        errors: {},
        existingCommuters: this.props.existingCommuters,
        groupModel: this.props.group
      }
    } else {
      this.state = {
        errors: {},
        groupModel: { organizationId: this.props.organizationId }
      }
    }
  }

  _handleSubmit = () => {
    const {appendMode, createCommuter, createGroup} = this.props
    const commutersToCreate = this.state.newCommuters
      ? this.state.newCommuters.map((commuter) => omit(commuter, '_id'))
      : []

    if (appendMode) {
      createCommuter(commutersToCreate)
    } else {
      const newGroup = {...this.state.groupModel}
      newGroup.commuters = commutersToCreate
      delete newGroup.newCommuters
      createGroup(newGroup)
    }
  }

  _onDrop = (files) => {
    const {appendMode, group} = this.props
    const r = new FileReader()

    r.onload = (e) => {
      const newCommuters = csvParse(e.target.result, (row) => {
        const {address, email, name} = row
        const _id = row._id || uuid.v4()
        // TODO: parse more field possibilities (first name, last name, etc)
        const newCommuter = {address, email, _id, name}
        if (appendMode) {
          newCommuter.groupId = group._id
        }
        return newCommuter
      })

      this.setState({newCommuters})
    }

    // TODO: handle multiple files
    r.readAsText(files[0])
  }

  _setErrors = errors => this.setState({ errors })

  _setModel = groupModel => this.setState({ groupModel })

  render () {
    const {appendMode, group, organizationId} = this.props
    const showAccordion = !!(this.state.existingCommuters || this.state.newCommuters)
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>
              <span>{appendMode ? 'Add Commuters to Group' : 'Create Commuter Group'}</span>
              <ButtonLink
                className='pull-right'
                to={appendMode ? `/group/${group._id}` : `/organization/${organizationId}`}
                >
                <Icon type='arrow-left' />
                <span>Back</span>
              </ButtonLink>
            </h3>
            <Form
              schema={groupSchema}
              value={this.state.groupModel}
              onChange={this._setModel}
              onError={this._setErrors}
              onSubmit={this._handleSubmit}
              >
              <FormalFieldGroup
                disabled={appendMode}
                label='Group Name'
                name='name'
                placeholder='Enter name'
                validationState={this.state.errors.name ? 'error' : undefined}
                />
              <Dropzone
                accept='text/csv'
                className='dropzone'
                multiple={false}
                onDrop={this._onDrop}
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
                      <CommuterTable
                        commuters={this.state.existingCommuters}
                        />
                    </Panel>
                  }
                  {!!(this.state.newCommuters) &&
                    <Panel
                      header={`${this.state.newCommuters.length} New Commuters`}
                      bsStyle='success'
                      eventKey='2'
                      >
                      <CommuterTable
                        commuters={this.state.newCommuters}
                        />
                    </Panel>
                  }
                </Accordion>
              }
              <Form.Button
                type='submit'
                className={'btn btn-success'}
                >
                {appendMode ? 'Append' : 'Create'}
              </Form.Button>
            </Form>
          </Col>
        </Row>
      </Grid>
    )
  }
}

function CommuterTable ({commuters}) {
  return (
    <BootstrapTable data={commuters}>
      <TableHeaderColumn dataField='_id' isKey hidden />
      <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
      <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
      <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
    </BootstrapTable>
  )
}
