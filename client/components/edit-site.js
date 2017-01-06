import {Browser} from 'leaflet'
import isNumber from 'lodash.isnumber'
import lonlng from 'lonlng'
import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row} from 'react-bootstrap'
import Form from 'react-formal'
import {Map as LeafletMap, Marker, TileLayer} from 'react-leaflet'
import yup from 'yup'

import ButtonLink from './button-link'
import FormalFieldGroup from './formal-fieldgroup'
import Geocoder from './geocoder'
import Icon from './icon'
import {geocodeResultToState, geocodeYupSchema} from '../utils/components'
import {messages, settings} from '../utils/env'
import {actUponConfirmation} from '../utils/ui'

const siteSchema = yup.object(Object.assign({
  name: yup.string().label('Site Name').required(),
  radius: yup.string().label('Ridematch Radius')
}, geocodeYupSchema))

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
      this.state = {
        errors: {},
        model: {...this.props.site}
      }
    } else {
      this.state = {
        errors: {},
        model: { organizationId: this.props.organizationId }
      }
    }
  }

  _handleDelete = () => {
    const doDelete = () => this.props.delete(this.state.model)
    actUponConfirmation(messages.organization.deleteConfirmation, doDelete)
  }

  _handleSubmit = () => {
    const {create, editMode, update} = this.props
    if (editMode) {
      update(this.state.model)
    } else {
      create(this.state.model)
    }
  }

  _setErrors = errors => this.setState({ errors })

  _setModel = model => this.setState({ model })

  render () {
    const {editMode, organizationId} = this.props
    const hasCoordinates = this.state.model.coordinate && isNumber(this.state.model.coordinate.lat)
    const position = hasCoordinates ? lonlng(this.state.model.coordinate) : lonlng(settings.geocoder.focus)
    const zoom = hasCoordinates ? 13 : 8
    return (
      <Grid>
        <Row>
          <Col xs={12} className='site-header'>
            <h3>
              <span>{`${editMode ? 'Edit' : 'Create'} Site`}</span>
              <ButtonLink
                className='pull-right'
                to={`/organization/${organizationId}`}
                >
                <Icon type='arrow-left' />
                <span>Back</span>
              </ButtonLink>
            </h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={5} className='site-form'>
            <Form
              schema={siteSchema}
              value={this.state.model}
              onChange={this._setModel}
              onError={this._setErrors}
              onSubmit={this._handleSubmit}
              >
              <FormalFieldGroup
                label='Site Name'
                name='name'
                placeholder='Enter name'
                validationState={this.state.errors.name ? 'error' : undefined}
                />
              <Form.Field
                label='Address'
                mapFromValue={geocodeResultToState}
                mapToValue={model => model.address ? { label: model.address } : undefined}
                name='address'
                type={Geocoder}
                validationState={this.state.errors.address ? 'error' : undefined}
                />
              <FormalFieldGroup
                label='Ridematch Radius (mi)'
                name='radius'
                placeholder='Enter radius'
                validationState={this.state.errors.radius ? 'error' : undefined}
                />
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
      </Grid>
    )
  }
}
