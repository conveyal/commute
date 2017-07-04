import {toLeaflet} from '@conveyal/lonlat'
import {Browser} from 'leaflet'
import isNumber from 'lodash.isnumber'
import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row} from 'react-bootstrap'
import Form from 'react-formal'
import {Map as LeafletMap, Marker, TileLayer} from 'react-leaflet'
import yup from 'yup'

import BackButton from '../containers/back-button'
import FormalFieldGroup from './formal-fieldgroup'
import Geocoder from './geocoder'
import {actUponConfirmation, geocodeResultToState, geocodeYupSchema} from '../utils'
import {pageview} from '../utils/analytics'
import messages from '../utils/messages'
import settings from '../utils/settings'

const commuterSchema = yup.object(Object.assign({
  name: yup.string().label('Site Name').required()
}, geocodeYupSchema))

export default class EditCommuter extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,

    // props
    editMode: PropTypes.bool,
    siteId: PropTypes.string.isRequired,
    commuter: PropTypes.object
  }

  componentWillMount () {
    if (this.props.editMode) {
      this.state = {
        errors: {},
        model: {...this.props.commuter}
      }
      pageview('/site/commuter/edit')
    } else {
      this.state = {
        errors: {},
        model: { siteId: this.props.siteId }
      }
      pageview('/site/commuter/create')
    }
  }

  _handleDelete = () => {
    const doDelete = () => this.props.delete(this.state.model)
    actUponConfirmation(messages.commuter.deleteConfirmation, doDelete)
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
    const {editMode} = this.props
    const hasCoordinates = this.state.model.coordinate && isNumber(this.state.model.coordinate.lat)
    const position = hasCoordinates
      ? toLeaflet(this.state.model.coordinate)
      : toLeaflet(settings.geocoder.focus)
    const zoom = hasCoordinates ? 13 : 9
    return (
      <Grid>
        <Row>
          <Col xs={12} className='commuter-header'>
            <h3>
              <span>{`${editMode ? 'Edit' : 'Create'} Commuter`}</span>
              <BackButton />
            </h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={5} className='commuter-form'>
            <Form
              schema={commuterSchema}
              value={this.state.model}
              onChange={this._setModel}
              onError={this._setErrors}
              onSubmit={this._handleSubmit}
              >
              <FormalFieldGroup
                label='Commuter Name'
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
