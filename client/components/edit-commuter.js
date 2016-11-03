import {Browser} from 'leaflet'
import isNumber from 'lodash.isnumber'
import lonlng from 'lonlng'
import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {Map as LeafletMap, Marker, TileLayer} from 'react-leaflet'
import {Link} from 'react-router'
import Geocoder from 'react-select-geocoder'

import FieldGroup from './fieldgroup'
import Icon from './icon'
import {messages, settings} from '../utils/env'
import {actUponConfirmation} from '../utils/ui'

export default class EditCommuter extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func,
    delete: PropTypes.func,
    update: PropTypes.func,

    // props
    editMode: PropTypes.bool,
    groupId: PropTypes.string.isRequired,
    organizationId: PropTypes.string.isRequired,
    commuter: PropTypes.object
  }

  componentWillMount () {
    if (this.props.editMode) {
      this.setState({...this.props.commuter})
    } else {
      this.state = {}
    }
  }

  handleChange = (name, event) => {
    this.setState({ [name]: event.target.value })
  }

  handleGeocoderChange = (value) => {
    if (value && value.geometry) {
      // received valid geocode result
      const coords = lonlng(value.geometry.coordinates)
      this.setState({
        address: value.properties.label,
        lat: coords.lat,
        lng: coords.lng
      })
    } else {
      // cleared geocode
      this.setState({
        address: '',
        lat: null,
        lng: null
      })
    }
  }

  handleDelete = () => {
    const doDelete = () => this.props.delete({
      commuterId: this.state.id,
      groupId: this.props.groupId,
      organizationId: this.props.organizationId
    })
    actUponConfirmation(messages.organization.deleteConfirmation, doDelete)
  }

  handleSubmit = () => {
    const {create, editMode, groupId, organizationId, update} = this.props
    if (editMode) {
      update({
        commuter: this.state,
        groupId: groupId,
        organizationId: organizationId
      })
    } else {
      create({
        commuter: this.state,
        groupId: groupId,
        organizationId: organizationId
      })
    }
  }

  render () {
    const {editMode, groupId, organizationId} = this.props
    const hasAddress = isNumber(this.state.lat) && isNumber(this.state.lng)
    const position = hasAddress ? lonlng(this.state) : lonlng(settings.map.focus)
    const zoom = hasAddress ? 13 : 8
    return (
      <Grid>
        <Row>
          <Col xs={12} className='commuter-header'>
            <h3>
              <span>{`${editMode ? 'Edit' : 'Create'} Commuter`}</span>
              <Button className='pull-right'>
                <Link to={`/organizations/${organizationId}/groups/${groupId}`}>
                  <Icon type='arrow-left' />
                  <span>Back</span>
                </Link>
              </Button>
            </h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={5} className='commuter-form'>
            <form>
              <FieldGroup
                label='Name'
                name='name'
                onChange={this.handleChange}
                placeholder='Enter name'
                type='text'
                value={this.state.name}
                />
              <FieldGroup
                label='Email'
                name='email'
                onChange={this.handleChange}
                placeholder='Enter email'
                type='text'
                value={this.state.email}
                />
              <Geocoder
                apiKey={process.env.MAPZEN_SEARCH_KEY}
                focusLatlng={settings.map.focus}
                onChange={this.handleGeocoderChange}
                />
            </form>
          </Col>
          <Col xs={12} lg={7} style={{height: '400px'}}>
            <LeafletMap center={position} zoom={zoom}>
              <TileLayer
                url={Browser.retina &&
                  process.env.LEAFLET_RETINA_URL
                  ? process.env.LEAFLET_RETINA_URL
                  : process.env.LEAFLET_TILE_URL}
                attribution={process.env.LEAFLET_ATTRIBUTION}
                />
              {hasAddress && <Marker position={position} /> }
            </LeafletMap>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className='commuter-submit-buttons'>
            <Button
              bsStyle={editMode ? 'warning' : 'success'}
              onClick={this.handleSubmit}
              >
              {editMode ? 'Update' : 'Create'}
            </Button>
            {editMode &&
              <Button
                bsStyle='danger'
                onClick={this.handleDelete}
                >
                Delete
              </Button>
            }
          </Col>
        </Row>
      </Grid>
    )
  }
}
