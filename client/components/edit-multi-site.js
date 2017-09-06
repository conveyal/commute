import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Form from 'react-formal'
import yup from 'yup'

import BackButton from '../containers/util/back-button'
import FormalFieldGroup from './util/formal-fieldgroup'
import {actUponConfirmation} from '../utils'
import {pageview} from '../utils/analytics'
import {
  entityIdArrayToEntityArray,
  entityMapToEntityArray
} from '../utils/entities'
import messages from '../utils/messages'

const multiSiteSchema = yup.object({
  name: yup.string().label('Multi-Site Analysis Name').required()
})

export default class EditSite extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,

    // props
    editMode: PropTypes.bool.isRequired,
    multiSite: PropTypes.object,
    siteStore: PropTypes.object.isRequired
  }

  componentWillMount () {
    if (this.props.editMode) {
      this.state = {
        errors: {},
        model: {...this.props.multiSite}
      }
      pageview('/multi-site/edit')
    } else {
      this.state = {
        errors: {},
        model: {
          sites: []
        }
      }
      pageview('/multi-site/create')
    }
  }

  _availableSiteToolsRenderer = (cell, row) => {
    return <Button bsStyle='success' onClick={this._onAddSiteClick.bind(this, row)}>Add</Button>
  }

  _handleDelete = () => {
    const doDelete = () => this.props.delete(this.state.model)
    actUponConfirmation(messages.multiSite.deleteConfirmation, doDelete)
  }

  _handleSubmit = () => {
    const {create, editMode, update} = this.props
    if (editMode) {
      update({ entity: this.state.model })
    } else {
      create(this.state.model)
    }
  }

  _multiSiteSiteToolsRenderer = (cell, row) => {
    return <Button bsStyle='danger' onClick={this._onRemoveSiteClick.bind(this, row)}>Remove</Button>
  }

  _onAddSiteClick = (row) => {
    const {model} = this.state
    model.sites.push(row._id)
    this.setState({ model })
  }

  _onRemoveSiteClick = (row) => {
    const {model} = this.state
    const siteIdx = model.sites.indexOf(row._id)
    model.sites.splice(siteIdx, 1)
    this.setState({ model })
  }

  _setErrors = errors => this.setState({ errors })

  _setModel = model => this.setState({ model })

  render () {
    const {editMode, siteStore} = this.props
    const {model} = this.state
    const multiSiteSites = entityIdArrayToEntityArray(model.sites, siteStore)
    const multiSiteSitesLookup = {}
    model.sites.forEach((siteId) => {
      multiSiteSitesLookup[siteId] = true
    })
    const availableSites = entityMapToEntityArray(siteStore).filter(
      (site) => !multiSiteSitesLookup[site._id]
    )
    return (
      <Grid>
        <Row>
          <Col xs={12} className='site-header'>
            <h3>
              <span>{editMode ? `Edit Multi-Site Analysis` : 'Create New Multi-Site Analysis'}</span>
              <BackButton />
            </h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className='multi-site-form'>
            <Form
              schema={multiSiteSchema}
              value={this.state.model}
              onChange={this._setModel}
              onError={this._setErrors}
              onSubmit={this._handleSubmit}
              >
              <FormalFieldGroup
                label='Multi-Site Analysis Name'
                name='name'
                placeholder='Enter name'
                validationState={this.state.errors.name ? 'error' : undefined}
                />
              <Row>
                <Col xs={6}>
                  <h4>{model.sites.length} Sites in Analysis</h4>
                  <BootstrapTable
                    data={multiSiteSites}
                    hover
                    options={{
                      noDataText: 'No sites added to this Multi-Site Analaysis'
                    }}
                    pagination={multiSiteSites.length > 10}
                    >
                    <TableHeaderColumn dataField='_id' isKey hidden />
                    <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
                    <TableHeaderColumn dataFormat={this._multiSiteSiteToolsRenderer}>Tools</TableHeaderColumn>
                  </BootstrapTable>
                </Col>
                <Col xs={6}>
                  <h4>{availableSites.length} available Sites to add</h4>
                  <BootstrapTable
                    data={availableSites}
                    hover
                    options={{
                      noDataText: 'All sites have been added to this Multi-Site Analaysis'
                    }}
                    pagination={availableSites.length > 10}
                    >
                    <TableHeaderColumn dataField='_id' isKey hidden />
                    <TableHeaderColumn
                      dataField='name'
                      filter={{
                        delay: 250,
                        placeholder: 'Filter by Name',
                        type: 'TextFilter'
                      }}
                      >
                      Name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField='address'
                      filter={{
                        delay: 250,
                        placeholder: 'Filter by Address',
                        type: 'TextFilter'
                      }}
                      >
                      Address
                    </TableHeaderColumn>
                    <TableHeaderColumn dataFormat={this._availableSiteToolsRenderer}>Tools</TableHeaderColumn>
                  </BootstrapTable>
                </Col>
              </Row>
              <ButtonGroup>
                <Form.Button
                  type='submit'
                  className={`btn ${this.props.editMode ? 'btn-warning' : 'btn-success'}`}
                  >
                  {this.props.editMode ? 'Update' : 'Create'}
                </Form.Button>
                {editMode &&
                  <Button
                    bsStyle='danger'
                    onClick={this._handleDelete}
                    >
                    Delete
                  </Button>
                }
              </ButtonGroup>
            </Form>
          </Col>
        </Row>
      </Grid>
    )
  }
}
