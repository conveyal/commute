import {toLeaflet} from '@conveyal/lonlat'
import {Browser, latLngBounds} from 'leaflet'
import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row, Tab, Tabs} from 'react-bootstrap'
import {Map as LeafletMap, Marker, TileLayer} from 'react-leaflet'

import BackButton from '../containers/back-button'
import ButtonLink from './button-link'
import {messages, settings} from '../utils/env'
import {actUponConfirmation} from '../utils/ui'

export default class Site extends Component {
  static propTypes = {
    // props
    site: PropTypes.object.isRequired,
    commuterStore: PropTypes.object.isRequired,

    // dispatch
    deleteSite: PropTypes.func.isRequired,
    loadSite: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.state = {
      activeTab: 'commuters'
    }
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

    // return only site marker if no commuters
    if (site.commuters.length === 0) {
      return {
        markers,
        position: sitePosition,
        zoom: 11
      }
    }

    // add all commuters to site
  }

  render () {
    const {site} = this.props
    const siteHasCommuters = site.commuters.length > 0
    const {bounds, markers, position, zoom} = this._mapCommuters()
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
                Delete Group
              </Button>
            </ButtonGroup>
          </Col>
          {/***************************
            Map
          ***************************/}
          <Col xs={12} style={{height: '400px', marginTop: '1em'}}>
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
            </Col>
          }
          {siteHasCommuters &&
            <Tabs
              activeKey={this.state.activeTab}
              onSelect={this._handleTabSelect}
              >
              <Tab eventKey='commuters' title='Commuters'>
                Commuters
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
