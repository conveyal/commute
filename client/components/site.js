import {toLeaflet} from '@conveyal/lonlat'
import {Browser, latLngBounds} from 'leaflet'
import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row, Tab, Tabs} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {CircleMarker, Map as LeafletMap, Marker, TileLayer} from 'react-leaflet'

import BackButton from '../containers/back-button'
import ButtonLink from './button-link'
import {entityIdArrayToEntityArray} from '../utils/entities'
import {messages} from '../utils/env'
import {actUponConfirmation} from '../utils/ui'

export default class Site extends Component {
  static propTypes = {
    // props
    site: PropTypes.object.isRequired,
    commuterStore: PropTypes.object.isRequired,

    // dispatch
    deleteCommuter: PropTypes.func.isRequired,
    deleteSite: PropTypes.func.isRequired,
    loadCommuters: PropTypes.func.isRequired,
    loadSite: PropTypes.func.isRequired
  }

  componentWillMount () {
    const {loadCommuters, site} = this.props
    if (site.commuters.length > 0) {
      loadCommuters({ siteId: site._id })
    }
    this.state = {
      activeTab: 'commuters'
    }
  }

  _commuterToolsRenderer = (cell, row) => {
    const {site} = this.props
    return <ButtonGroup>
      <ButtonLink
        bsStyle='warning'
        to={`/site/${site._id}/commuter/${row._id}/edit`}>
        Edit
      </ButtonLink>
      <Button bsStyle='danger' onClick={this._onDeleteCommuterClick.bind(this, row)}>Delete</Button>
    </ButtonGroup>
  }

  _handleDelete = () => {
    const doDelete = () => this.props.deleteSite(this.props.site)
    actUponConfirmation(messages.site.deleteConfirmation, doDelete)
  }

  _handleTabSelect = (selectedTab) => {
    this.setState({ activeTab: selectedTab })
  }

  _mapCommuters = () => {
    const {commuterStore, site} = this.props
    const sitePosition = toLeaflet(site.coordinate)

    // add site marker
    const markers = [
      <Marker
        key='site-marker'
        position={sitePosition}
      />
    ]

    // add all commuters to site
    const bounds = latLngBounds([sitePosition, sitePosition])

    site.commuters.forEach((commuterId) => {
      const commuter = commuterStore[commuterId]
      if (!commuter) return
      const commuterPosition = toLeaflet(commuter.coordinate)
      markers.push(
        <CircleMarker
          key={`commuter-marker-${commuter._id}`}
          center={commuterPosition}
          />
      )
      bounds.extend(commuterPosition)
    })

    // return only site marker if no commuters or commuters haven't loaded yet
    if (site.commuters.length === 0 || markers.length === 1) {
      return {
        markers,
        position: sitePosition,
        zoom: 11
      }
    }

    return {
      bounds,
      markers
    }
  }

  _onDeleteCommuterClick (commuter) {
    const doDelete = () => this.props.deleteCommuter(commuter)
    actUponConfirmation(messages.commuter.deleteConfirmation, doDelete)
  }

  render () {
    const {commuterStore, site} = this.props
    const siteHasCommuters = site.commuters.length > 0
    const siteCommuters = entityIdArrayToEntityArray(site.commuters, commuterStore)
    const {bounds, markers, position, zoom} = this._mapCommuters()
    const createCommuterButtons = (
      <ButtonGroup>
        <ButtonLink
          bsStyle='info'
          to={`/site/${site._id}/commuter/create`}
          >
          Create New Commuter
        </ButtonLink>
        <ButtonLink
          bsStyle='success'
          to={`/site/${site._id}/bulk-add-commuters`}
          >
          Bulk Add Commuters
        </ButtonLink>
      </ButtonGroup>
    )
    return (
      <Grid>
        <Row>
          {/***************************
            Header
          ***************************/}
          <Col xs={12}>
            <h3>
              <span>{site.name}</span>
              <BackButton />
            </h3>
            <p>{site.address}</p>
            <ButtonGroup>
              <ButtonLink
                bsStyle='warning'
                to={`/site/${site._id}/edit`}
                >
                Edit
              </ButtonLink>
              <Button
                bsStyle='danger'
                onClick={this._handleDelete}
                >
                Delete
              </Button>
            </ButtonGroup>
          </Col>
          {/***************************
            Map
          ***************************/}
          <Col xs={12} style={{height: '400px', marginTop: '1em', marginBottom: '1em'}}>
            <LeafletMap center={position} bounds={bounds} zoom={zoom}>
              <TileLayer
                url={Browser.retina &&
                  process.env.LEAFLET_RETINA_URL
                  ? process.env.LEAFLET_RETINA_URL
                  : process.env.LEAFLET_TILE_URL}
                attribution={process.env.LEAFLET_ATTRIBUTION}
                />
              {markers}
            </LeafletMap>
          </Col>
          {/***************************
            Content
          ***************************/}
          {!siteHasCommuters &&
            <Col xs={12}>
              <p>This site doesn't have any commuters yet!  Add some using one of the options below:</p>
              {createCommuterButtons}
            </Col>
          }
          {siteHasCommuters &&
            <Tabs
              activeKey={this.state.activeTab}
              id='site-tabs'
              onSelect={this._handleTabSelect}
              >
              <Tab eventKey='commuters' title='Commuters'>
                <Row>
                  <Col xs={12}>
                    {createCommuterButtons}
                    <BootstrapTable data={siteCommuters}>
                      <TableHeaderColumn dataField='_id' isKey hidden />
                      <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
                      <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
                      <TableHeaderColumn dataFormat={geocodeConfidenceRenderer}>Geocode Confidence</TableHeaderColumn>
                      <TableHeaderColumn dataFormat={this._commuterToolsRenderer}>Tools</TableHeaderColumn>
                    </BootstrapTable>
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey='analysis' title='Analysis'>
                Analysis
              </Tab>
              <Tab eventKey='ridematches' title='Ridematches'>
                Ridematches
              </Tab>
            </Tabs>
          }
        </Row>
      </Grid>
    )
  }
}

function geocodeConfidenceRenderer (cell, row) {
  const {geocodeConfidence} = row
  if (geocodeConfidence === -1) {
    return 'calculating...'
  } else if (geocodeConfidence >= 0.8) {
    return 'Good'
  } else {
    return 'Not exact'
  }
}
