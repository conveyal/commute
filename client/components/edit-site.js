import {toLeaflet} from '@conveyal/lonlat'
import {Browser} from 'leaflet'
import isNumber from 'lodash.isnumber'
import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row, Panel} from 'react-bootstrap'
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
import Icon from './icon'

const siteSchema = yup.object(Object.assign({
  name: yup.string().label('Site Name').required()
}, geocodeYupSchema))

export default class EditSite extends Component {
  static propTypes = {
    // dispatch
    create: PropTypes.func.isRequired,
    deletePolygons: PropTypes.func.isRequired,
    deleteSite: PropTypes.func.isRequired,
    deleteSiteFromMultiSites: PropTypes.func.isRequired,
    updateSite: PropTypes.func.isRequired,

    // props
    editMode: PropTypes.bool.isRequired,
    site: PropTypes.object
  }

  componentWillMount () {
    this._setStateFromProps(this.props)
    if (this.props.editMode) {
      pageview('/site/edit')
    } else {
      pageview('/site/create')
    }
  }

  componentWillReceiveProps (nextProps) {
    this._setStateFromProps(nextProps)
  }

  _handleDelete = () => {
    const doDelete = () => {
      this.props.deleteSite(this.state.model)
      this.props.deletePolygons({ siteId: this.state.model._id })
    }
    actUponConfirmation(messages.site.deleteConfirmation, doDelete)
  }

  _handleSubmit = () => {
    const {
      create,
      deletePolygons,
      deleteSiteFromMultiSites,
      editMode,
      multiSites,
      site,
      updateSite
    } = this.props
    const {model} = this.state

    // reset calculation status if new or if location of site changed
    if (!editMode || (
      (site.address !== model.address) ||
      (site.coordinate.lat !== model.coordinate.lat) ||
      (site.coordinate.lon !== model.coordinate.lon))) {
      model.travelTimeIsochrones = {}
      model.calculationStatus = 'calculating'
    }
    if (editMode) {
      if (model.calculationStatus === 'calculating') {
        deletePolygons({ siteId: this.state.model._id })
        deleteSiteFromMultiSites({ multiSites, siteId: site._id })
      }
      updateSite(model)
    } else {
      create(model)
    }
  }

  _setErrors = errors => this.setState({ errors })

  _setModel = model => this.setState({ model })

  _setStateFromProps (props) {
    if (props.editMode) {
      this.setState({
        errors: {},
        model: {...props.site}
      })
    } else {
      this.setState({
        errors: {},
        model: {}
      })
    }
  }

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
          <Col xs={12} className='site-header'>
            <h3>
              <span>{editMode ? `Edit Site` : 'Create New Site'}</span>
              <BackButton />
            </h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={5} className='site-form'>
            <Panel>
              <Col xs={2}>
                <Icon type='info-circle' style={{ fontSize: '36px', color: '#337ab7' }} />
              </Col>
              <Col xs={10}>
                A <b>Site</b> is an single location (e.g., a workplace) where analysis will be performed for a collection of people commuting to that location. To get started, enter a name and location for the site below and click "Create".
              </Col>
            </Panel>
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
