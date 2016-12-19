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
import {geocodeResultToState} from '../utils/components'
import {messages, settings} from '../utils/env'
import {actUponConfirmation} from '../utils/ui'

export default class EditSite extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,

    // props
    editMode: PropTypes.bool.isRequired,
    organizationId: PropTypes.string.isRequired,
    site: PropTypes.object
  }

  componentWillMount () {
    if (this.props.editMode) {
      this.setState({...this.props.site})
    } else {
      this.state = {
        organizationId: this.props.organizationId
      }
    }
  }

  _handleChange = (name, event) => {
    this.setState({ [name]: event.target.value })
  }

  _handleGeocoderChange = (value) => {
    if (value && value.geometry) {
      // received valid geocode result
      this.setState(geocodeResultToState(value))
    } else {
      // cleared geocode
      this.setState({
        address: '',
        coordinate: {}
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
    const {editMode, organizationId} = this.props
    const hasCoordinates = this.state.coordinate && isNumber(this.state.coordinate.lat)
    const position = hasCoordinates ? lonlng(this.state.coordinate) : lonlng(settings.geocoder.focus)
    const zoom = hasCoordinates ? 13 : 8
    return (
      <Grid>
        <Row>
          <Col xs={12} className='site-header'>
            <h3>
              <span>{`${editMode ? 'Edit' : 'Create'} Site`}</span>
              <Button className='pull-right'>
                <Link to={`/organization/${organizationId}`}><Icon type='arrow-left' />Back</Link>
              </Button>
            </h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={5} className='site-form'>
            <form>
              <FieldGroup
                label='Name'
                name='name'
                onChange={this._handleChange}
                placeholder='Enter name'
                type='text'
                value={this.state.name}
                />
              <Geocoder
                label='Address'
                onChange={this._handleGeocoderChange}
                value={this.state.address && { label: this.state.address }}
                />
              <FieldGroup
                label='Ridematch Radius (mi)'
                name='radius'
                onChange={this._handleChange}
                placeholder='Enter radius'
                type='text'
                value={this.state.radius}
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
              {hasCoordinates && <Marker position={position} /> }
            </LeafletMap>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className='site-submit-buttons'>
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
