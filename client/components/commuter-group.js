import {Browser, latLngBounds} from 'leaflet'
import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Form from 'react-formal'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'
import yup from 'yup'

import ButtonLink from './button-link'
import FormalFieldGroup from './formal-fieldgroup'
import Icon from './icon'
import MarkerCluster from './marker-cluster'
import ProgressManager from './progress-manager'
import {messages, settings} from '../utils/env'
import {actUponConfirmation} from '../utils/ui'

const groupSchema = yup.object({
  name: yup.string().label('Group Name').required()
})

export default class CommuterGroup extends Component {
  static propTypes = {
    // dispatch
    deleteCommuter: PropTypes.func.isRequired,
    deleteGroup: PropTypes.func.isRequired,
    loadCommuters: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,

    // props
    commuters: PropTypes.array.isRequired,
    group: PropTypes.object.isRequired,
    numCommutersGeocoded: PropTypes.number.isRequired
  }

  componentWillMount () {
    this._loadCommuters()
    this.state = {
      editingName: false,
      errors: {},
      model: this.props.group
    }
  }

  _commuterToolsRenderer = (cell, row) => {
    return <ButtonGroup>
      <ButtonLink
        bsStyle='warning'
        to={`/commuter/${row._id}/edit`}>
        Edit
      </ButtonLink>
      <Button bsStyle='danger' onClick={this._onDeleteCommuterClick.bind(this, row)}>Delete</Button>
    </ButtonGroup>
  }

  _handleCancelEdit = () => {
    this.setState({ editingName: false })
  }

  _handleDelete = () => {
    const {_id: groupId, organizationId} = this.props.group
    const doDelete = () => this.props.deleteGroup(groupId, organizationId)
    actUponConfirmation(messages.organization.deleteConfirmation, doDelete)
  }

  _handleEditName = () => {
    this.setState({ editingName: true })
  }

  _handleSaveName = () => {
    this.props.update(this.state.model)
    this.setState({ editingName: false })
  }

  _loadCommuters () {
    this.props.loadCommuters({ groupId: this.props.group._id })
  }

  _onDeleteCommuterClick (commuter) {
    const doDelete = () => this.props.deleteCommuter(commuter)
    actUponConfirmation(messages.commuter.deleteConfirmation, doDelete)
  }

  _setErrors = errors => this.setState({ errors })

  _setModel = model => this.setState({ model })

  render () {
    const {commuters, group, numCommutersGeocoded} = this.props
    const allAddressesGeocoded = commuters.length === numCommutersGeocoded
    const {editingName} = this.state
    const {_id: groupId, name: groupName, organizationId} = group
    const {bounds, markers, position, zoom} = mapCommuters(commuters)
    return (
      <Grid>
        <Row>
          <Col xs={12} className='group-header'>
            <h3>
              {editingName &&
                <Form
                  schema={groupSchema}
                  value={this.state.model}
                  onChange={this._setModel}
                  onError={this._setErrors}
                  onSubmit={this._handleSaveName}
                  >
                  <FormalFieldGroup
                    name='name'
                    placeholder='Enter name'
                    validationState={this.state.errors.name ? 'error' : undefined}
                    />
                  <Form.Button
                    type='submit'
                    className='btn btn-default'
                    >
                    <Icon type='floppy-o' />
                  </Form.Button>
                  <Button
                    onClick={this._handleCancelEdit}
                    >
                    <Icon type='close' />
                  </Button>
                </Form>
              }
              {!editingName &&
                <span>{groupName}</span>
              }
              <ButtonLink
                className='pull-right'
                to={`/organization/${organizationId}`}
                >
                <Icon type='arrow-left' />
                <span>Back</span>
              </ButtonLink>
            </h3>
            <ButtonGroup>
              {!editingName &&
                <Button
                  bsStyle='warning'
                  onClick={this._handleEditName}
                  >
                  <Icon type='pencil' />
                  <span>Edit Name</span>
                </Button>
              }
              <Button bsStyle='danger' onClick={this._handleDelete}>Delete Group</Button>
            </ButtonGroup>
          </Col>
          <Col xs={12} style={{height: '400px', marginTop: '1em'}}>
            <LeafletMap center={position} bounds={bounds} zoom={zoom}>
              <TileLayer
                url={Browser.retina &&
                  process.env.LEAFLET_RETINA_URL
                  ? process.env.LEAFLET_RETINA_URL
                  : process.env.LEAFLET_TILE_URL}
                attribution={process.env.LEAFLET_ATTRIBUTION}
                />
              <MarkerCluster
                newMarkerData={markers}
                />
            </LeafletMap>
          </Col>
          {!allAddressesGeocoded &&
            <Col xs={12} className='group-geocode-progress'>
              <h4>Geocoding commuter addresses...</h4>
              <ProgressManager
                numDone={numCommutersGeocoded}
                numTotal={commuters.length}
                refreshFn={() => this._loadCommuters()}
                intervalLengthMs={1200}
                />
            </Col>
          }
        </Row>
        <Row className='group-content'>
          <Col xs={12}>
            <h3>Commuters</h3>
            <ButtonGroup>
              <ButtonLink
                bsStyle='info'
                to={`/group/${groupId}/commuter/create`}
                >
                <Icon type='plus' />
                <span>Create New Commuter</span>
              </ButtonLink>
              <ButtonLink
                bsStyle='warning'
                to={`/group/${groupId}/add`}
                >
                Add Commuters in Bulk
              </ButtonLink>
            </ButtonGroup>
            <BootstrapTable data={commuters}>
              <TableHeaderColumn dataField='_id' isKey hidden />
              <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='original_address'>Original Address</TableHeaderColumn>
              <TableHeaderColumn dataField='address'>Geocoded Address</TableHeaderColumn>
              <TableHeaderColumn dataFormat={geocodeConfidenceRenderer}>Geocode Confidence</TableHeaderColumn>
              <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._commuterToolsRenderer}>Tools</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Grid>
    )
  }
}

function mapCommuters (commuters) {
  if (commuters.length === 0) {
    return {
      markers: [],
      position: settings.geocoder.focus,
      zoom: 8
    }
  } else if (commuters.length === 1) {
    const firstCommuter = commuters[0]
    const {lat, lon} = firstCommuter.coordinate
    return {
      markers: [{
        id: firstCommuter._id,
        caption: firstCommuter.name,
        position: [lat, lon]
      }],
      position: settings.geocoder.focus,
      zoom: 8
    }
  }
  const markers = []
  const firstLL = [commuters[0].coordinate.lat, commuters[0].coordinate.lon]
  const bounds = latLngBounds([firstLL, firstLL])
  commuters.forEach((commuter) => {
    const {_id, coordinate, name} = commuter
    const {lat, lon} = coordinate
    const leafletLatLng = [lat, lon]
    if (commuter.coordinate.lat && commuter.coordinate.lon) {
      markers.push({
        id: _id,
        caption: name,
        latLng: leafletLatLng
      })
      bounds.extend(leafletLatLng)
    }
  })
  return {bounds, markers}
}

function geocodeConfidenceRenderer (cell, row) {
  const {geocodeConfidence} = row
  if (geocodeConfidence === -1) {
    return 'calculating...'
  } else {
    return `${Math.round(geocodeConfidence * 100)} %`
  }
}
