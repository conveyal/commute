import {Browser} from 'leaflet'
import isNumber from 'lodash.isnumber'
import lonlng from 'lonlng'
import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {Map as LeafletMap, Marker, TileLayer} from 'react-leaflet'
import {Link} from 'react-router'

import FieldGroup from './fieldgroup'
import Geocoder from './geocoder'
import Icon from './icon'
import {messages, settings} from '../utils/env'
import {actUponConfirmation} from '../utils/ui'

export default class EditCommuter extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,

    // props
    editMode: PropTypes.bool,
    groupId: PropTypes.string.isRequired,
    commuter: PropTypes.object
  }

  componentWillMount () {
    if (this.props.editMode) {
      this.setState({...this.props.commuter})
    } else {
      this.state = {
        groupId: this.props.groupId
      }
    }
  }

  _handleChange = (name, event) => {
    this.setState({ [name]: event.target.value })
  }

  _handleGeocoderChange = (value) => {
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

  _handleDelete = () => {
    const doDelete = () => this.props.delete(this.state)
    actUponConfirmation(messages.organization.deleteConfirmation, doDelete)
  }

  _handleSubmit = () => {
    const {create, editMode, update} = this.props
    if (editMode) {
      update(this.state)
    } else {
      create(this.state)
    }
  }

  render () {
    const {editMode, groupId} = this.props
    const hasAddress = isNumber(this.state.lat) && isNumber(this.state.lng)
    const position = hasAddress ? lonlng(this.state) : lonlng(settings.geocoder.focus)
    const zoom = hasAddress ? 13 : 8
    return (
      <Grid>
        <Row>
          <Col xs={12} className='commuter-header'>
            <h3>
              <span>{`${editMode ? 'Edit' : 'Create'} Commuter`}</span>
              <Button className='pull-right'>
                <Link to={`/group/${groupId}`}>
                  <Icon type='arrow-left' />
                  <span>Back</span>
                </Link>
              </Button>
            </h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={5} className='commuter-form'>
            <form>
              <FieldGroup
                label='Name'
                name='name'
                onChange={this._handleChange}
                placeholder='Enter name'
                type='text'
                value={this.state.name}
                />
              <FieldGroup
                label='Email'
                name='email'
                onChange={this._handleChange}
                placeholder='Enter email'
                type='text'
                value={this.state.email}
                />
              <Geocoder
                label='address'
                onChange={this._handleGeocoderChange}
                value={this.state.address && { label: this.state.address }}
                />
            </form>
          </Col>
          <Col xs={12} md={7} style={{height: '400px'}}>
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
              onClick={this._handleSubmit}
              >
              {editMode ? 'Update' : 'Create'}
            </Button>
            {editMode &&
              <Button
                bsStyle='danger'
                onClick={this._handleDelete}
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
