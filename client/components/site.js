import {toLeaflet} from '@conveyal/lonlat'
import hslToHex from 'colorvert/hsl/hex'
import {Browser, icon, latLngBounds} from 'leaflet'
import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Row, Tab, Table, Tabs} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {GeoJSON, Map as LeafletMap, Marker, TileLayer} from 'react-leaflet'

import BackButton from '../containers/back-button'
import ButtonLink from './button-link'
import FieldGroup from './fieldgroup'
import {messages} from '../utils/env'
import {actUponConfirmation} from '../utils/ui'

export default class Site extends Component {
  static propTypes = {
    // props
    site: PropTypes.object.isRequired,
    commuters: PropTypes.array.isRequired,

    // dispatch
    deleteCommuter: PropTypes.func.isRequired,
    deleteSite: PropTypes.func.isRequired,
    loadCommuters: PropTypes.func.isRequired,
    loadSite: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.state = {
      activeTab: 'commuters',
      analysisMode: 'TRANSIT',
      isochroneColoring: 'multi-color'
    }
    this._loadCommutersIfNeeded(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this._loadCommutersIfNeeded(nextProps)
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

  _handleAnalysisModeChange = (name, event) => {
    this.setState({ analysisMode: event.target.value })
  }

  _handleDelete = () => {
    const doDelete = () => this.props.deleteSite(this.props.site)
    actUponConfirmation(messages.site.deleteConfirmation, doDelete)
  }

  _handleTabSelect = (selectedTab) => {
    this.setState({ activeTab: selectedTab })
  }

  _loadCommutersIfNeeded (props) {
    const {commuters, loadCommuters, site} = props
    let shouldLoad = false

    // check if all commuters have been loaded
    if (site.commuters.length > commuters.length) {
      // not all commuters loaded in store
      shouldLoad = true
    }

    // check if all commuters have been geocoded and have stats calculated
    for (let i = 0; i < commuters.length; i++) {
      const curCommuter = commuters[i]
      const isGeocoded = curCommuter.geocodeConfidence !== -1
      const hasStats = curCommuter.modeStats
      if (!isGeocoded || !hasStats) {
        shouldLoad = true
        break
      }
    }

    if (shouldLoad && !this.loadCommutersInterval) {
      this.loadCommutersInterval = setInterval(function () {
        loadCommuters({ siteId: site._id })
      }, 1111)
    } else if (!shouldLoad && this.loadCommutersInterval) {
      clearInterval(this.loadCommutersInterval)
    }
  }

  _mapCommuters = () => {
    const {commuters, site} = this.props
    const sitePosition = toLeaflet(site.coordinate)

    // add site marker
    const markers = [
      <Marker
        key='site-marker'
        position={sitePosition}
        zIndexOffset={9000}
      />
    ]

    // add all commuters to site
    const bounds = latLngBounds([sitePosition, sitePosition])

    commuters.forEach((commuter) => {
      if (commuter.coordinate.lat === 0) return  // don't include commuters not geocoded yet
      const commuterPosition = toLeaflet(commuter.coordinate)
      markers.push(
        <Marker
          icon={homeIcon}
          key={`commuter-marker-${commuter._id}`}
          position={commuterPosition}
          zIndexOffset={1234}
          />
      )
      bounds.extend(commuterPosition)
    })

    // return only site marker if no commuters or commuters haven't loaded yet
    if (markers.length === 1) {
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
    const {commuters, site} = this.props
    const {activeTab, analysisMode, isochroneColoring} = this.state

    // map stuff
    const {bounds, markers, position, zoom} = this._mapCommuters()
    const isochrones = []
    if (activeTab === 'analysis') {
      const curIsochrones = site.travelTimeIsochrones[analysisMode]
      curIsochrones.features.forEach((isochrone) => {
        const geojsonProps = {
          data: isochrone,
          key: `isochrone-${analysisMode}-${isochrone.properties.time}`,
          onEachFeature,
          stroke: false,
          fillOpacity: 0.4
        }

        if (isochroneColoring) {
          geojsonProps.style = styleIsochrone
        }

        isochrones.push(
          <GeoJSON {...geojsonProps} />
        )
      })
    }

    // stuff for commuter tab
    const siteHasCommuters = site.commuters.length > 0
    const pctGeocoded = Math.round(100 * commuters.reduce((accumulator, commuter) => {
      return accumulator + (commuter.geocodeConfidence !== -1 ? 1 : 0)
    }, 0) / site.commuters.length)
    const pctStatsCalculated = Math.round(100 * commuters.reduce((accumulator, commuter) => {
      return accumulator + (commuter.modeStats ? 1 : 0)
    }, 0) / site.commuters.length)
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

    // stuff for analysis Tab
    const analysisModeStatsLookup = {}
    commuters.forEach((commuter) => {
      let travelTime
      if (commuter.modeStats) {
        travelTime = commuter.modeStats[analysisMode].travelTime
      } else {
        travelTime = -1
      }
      // convert unreachable to high value for sorting purposes
      if (travelTime === -1) {
        travelTime = 9999
      }
      if (!analysisModeStatsLookup[travelTime]) {
        analysisModeStatsLookup[travelTime] = 0
      }
      analysisModeStatsLookup[travelTime]++
    })

    let cumulative = 0
    const analysisModeStats = Object.keys(analysisModeStatsLookup)
      .sort((a, b) => a - b)
      .map((range) => {
        const minutes = range / 60
        const num = analysisModeStatsLookup[range]
        cumulative += num
        return {
          bin: range < 9999 ? `${minutes - 5} - ${minutes}` : 'N/A',
          num,
          cumulative: cumulative + 0
        }
      })

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
              {isochrones}
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
              activeKey={activeTab}
              id='site-tabs'
              onSelect={this._handleTabSelect}
              >
              <Tab eventKey='commuters' title='Commuters'>
                {/***************************
                  Commuters Tab
                ***************************/}
                <Row>
                  <Col xs={12}>
                    {createCommuterButtons}
                    <span className='pull-right'>
                      <Table condensed bordered>
                        <tbody>
                          <tr>
                            <td>% of commuters geocoded:</td>
                            <td>{pctGeocoded}</td>
                          </tr>
                          <tr>
                            <td>% of commutes calculated:</td>
                            <td>{pctStatsCalculated}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </span>
                    <div style={{ clear: 'both' }}>
                      <BootstrapTable data={commuters}>
                        <TableHeaderColumn dataField='_id' isKey hidden />
                        <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
                        <TableHeaderColumn dataFormat={geocodeConfidenceRenderer}>Geocode Confidence</TableHeaderColumn>
                        <TableHeaderColumn dataFormat={this._commuterToolsRenderer}>Tools</TableHeaderColumn>
                      </BootstrapTable>
                    </div>
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey='analysis' title='Analysis'>
                {/***************************
                  Analysis Tab
                ***************************/}
                <FieldGroup
                  label='Mode'
                  name='mode'
                  onChange={this._handleAnalysisModeChange}
                  componentClass='select'
                  value={analysisMode}
                  >
                  <option value='TRANSIT'>Transit</option>
                  <option value='BICYCLE'>Bicycle</option>
                  <option value='WALK'>Walk</option>
                  <option value='CAR'>Car</option>
                </FieldGroup>
                <BootstrapTable data={analysisModeStats}>
                  <TableHeaderColumn dataField='bin' isKey>Time in Minutes</TableHeaderColumn>
                  <TableHeaderColumn dataField='num'>Number in Range</TableHeaderColumn>
                  <TableHeaderColumn dataField='cumulative'>Cumulative Number</TableHeaderColumn>
                </BootstrapTable>
              </Tab>
              <Tab eventKey='ridematches' title='Ridematches'>
                {/***************************
                  Ridematches Tab
                ***************************/}
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

const homeIcon = icon({
  iconUrl: '../assets/home-2.png',
  iconSize: [32, 37],
  iconAnchor: [22, 37]
})

function onEachFeature (feature, layer) {
  if (feature.properties) {
    let pop = '<p>'
    Object.keys(feature.properties).forEach((name) => {
      pop += name.toUpperCase()
      pop += ': '
      pop += feature.properties[name]
      pop += '<br />'
    })
    pop += '</p>'
    layer.bindPopup(pop)
  }
}

function styleIsochrone (feature) {
  return {
    fillColor: hslToHex(feature.properties.time * -0.017391304347826 + 125.217391304348, 100, 50)
  }
}
