import hslToHex from 'colorvert/hsl/hex'
import {toCoordinates, toLeaflet} from '@conveyal/lonlat'
import humanizeDuration from 'humanize-duration'
import {geom, io, precision, simplify} from 'jsts'
import {Browser, icon, latLngBounds} from 'leaflet'
import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, Grid, Panel, ProgressBar, Row, Tab, Table, Tabs} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {GeoJSON, Map as LeafletMap, Marker, TileLayer} from 'react-leaflet'
import Slider from 'rc-slider'
import distance from '@turf/distance'

import BackButton from '../containers/back-button'
import ButtonLink from './button-link'
import FieldGroup from './fieldgroup'
import Legend from './legend'
import MarkerCluster from './marker-cluster'
import messages from '../utils/messages'
import {arrayCountRenderer} from '../utils/table'
import {actUponConfirmation} from '../utils/ui'

const geoJsonReader = new io.GeoJSONReader()
const geoJsonWriter = new io.GeoJSONWriter()

export default class Site extends Component {
  static propTypes = {
    // props
    isMultiSite: PropTypes.bool.isRequired,
    multiSite: PropTypes.object,
    polygonStore: PropTypes.object,
    site: PropTypes.object,
    sites: PropTypes.array,
    siteStore: PropTypes.object,
    commuters: PropTypes.array.isRequired,

    // dispatch
    deleteCommuter: PropTypes.func,
    deleteMainEntity: PropTypes.func.isRequired,
    deletePolygons: PropTypes.func,
    deleteSiteFromMultiSites: PropTypes.func,
    loadCommuters: PropTypes.func.isRequired,
    loadPolygons: PropTypes.func,
    loadSite: PropTypes.func
  }

  componentWillMount () {
    this.state = {
      activeTab: this.props.isMultiSite ? 'sites' : 'commuters',
      analysisMode: 'TRANSIT',
      analysisMapStyle: 'blue-incremental',
      isochroneCutoff: 7200,
      rideMatchMapStyle: 'normal'
    }
    this._loadDataIfNeeded(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this._loadDataIfNeeded(nextProps)
  }

  componentWillUnmount () {
    if (this.loadSiteInterval) {
      clearInterval(this.loadSiteInterval)
    }

    if (this.loadCommutersInterval) {
      clearInterval(this.loadCommutersInterval)
    }
  }

  _commuterSiteNameRenderer = (cell, row) => {
    const {siteStore} = this.props
    return siteStore[row.siteId].name
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

  _handleAnalysisTimeChange = (value) => {
    this.setState({ isochroneCutoff: value })
  }

  _handleStateChange = (name, event) => {
    this.setState({ [name]: event.target.value })
  }

  _handleDelete = () => {
    const {
      deleteMainEntity,
      deletePolygons,
      deleteSiteFromMultiSites,
      isMultiSite,
      multiSite,
      multiSites,
      site
    } = this.props
    const doDelete = () => {
      deleteMainEntity(isMultiSite ? multiSite : site)
      if (!isMultiSite) {
        deletePolygons({ siteId: site._id })
        deleteSiteFromMultiSites({ multiSites, siteId: site._id })
      }
    }
    const messageType = isMultiSite ? 'multiSite' : 'site'
    actUponConfirmation(messages[messageType].deleteConfirmation, doDelete)
  }

  _handleTabSelect = (selectedTab) => {
    this.setState({ activeTab: selectedTab })
  }

  _loadDataIfNeeded (props) {
    const {
      commuters,
      isMultiSite,
      loadCommuters,
      loadPolygons,
      loadSite,
      multiSite,
      polygonStore,
      site,
      sites
    } = props

    /***************************************************************
     determine if commuters should be loaded
    ***************************************************************/
    let shouldLoadCommuters = false

    const allCommutersLoadedFromAllSites = () => {
      let numCommutersInSites = sites.reduce((accumulator, currentSite) => {
        return accumulator + currentSite.commuters.length
      }, 0)
      return numCommutersInSites === commuters.length
    }

    // check if all commuters have been loaded
    if ((!isMultiSite && (site.commuters.length > commuters.length)) ||
      (isMultiSite && !allCommutersLoadedFromAllSites())) {
      // not all commuters loaded in store
      shouldLoadCommuters = true
    } else {
      // check if all commuters have been geocoded and have stats calculated
      for (let i = 0; i < commuters.length; i++) {
        const curCommuter = commuters[i]
        const isGeocoded = curCommuter.geocodeConfidence !== -1
        const hasStats = curCommuter.modeStats
        if (!isGeocoded || !hasStats) {
          shouldLoadCommuters = true
          break
        }
      }
    }

    if (shouldLoadCommuters && !this.loadCommutersInterval) {
      // load commuters if not already doing so
      let loadCommutersQuery
      if (isMultiSite) {
        // query for commuters at all siteIds
        loadCommutersQuery = {
          siteId: {
            $in: multiSite.sites
          }
        }
      } else {
        // load commuters only from specific site
        loadCommutersQuery = { siteId: site._id }
      }
      this.loadCommutersInterval = setInterval(() => {
        loadCommuters(loadCommutersQuery)
      }, 1111)
    } else if (!shouldLoadCommuters && this.loadCommutersInterval) {
      clearInterval(this.loadCommutersInterval)
    }

    /***************************************************************
     determine if site should be loaded
    ***************************************************************/
    if (site &&
      site.calculationStatus === 'calculating') {
      // should load site
      if (!this.loadSiteInterval) {
        this.loadSiteInterval = setInterval(() => {
          loadSite(site._id)
        }, 1111)
      }
    } else {
      // site doens't need to load
      if (this.loadSiteInterval) {
        clearInterval(this.loadSiteInterval)
      }
    }

    /***************************************************************
     determine if polygons should be loaded
    ***************************************************************/
    const atLeastOnePolygonExistsInStore = Object.values(polygonStore)
      .some((isochrone) => isochrone.siteId === site._id)

    if (site &&
      site.calculationStatus === 'successfully' &&
      !atLeastOnePolygonExistsInStore) {
      // if 0 polygons exist for site, assume they need to be fetched
      loadPolygons({ siteId: site._id })
    }
  }

  _mapSitesAndCommuters = () => {
    const {commuters, isMultiSite, site, sites} = this.props
    const commuterMarkers = []
    const siteMarkers = []
    let sitesToMakeMarkersFor

    if (isMultiSite) {
      sitesToMakeMarkersFor = sites
    } else {
      sitesToMakeMarkersFor = [site]
    }

    const firstSiteCoordinates = toLeaflet(sitesToMakeMarkersFor[0].coordinate)
    const bounds = latLngBounds([firstSiteCoordinates, firstSiteCoordinates])

    sitesToMakeMarkersFor.forEach((siteToMakeMarkerFor) => {
      const sitePosition = toLeaflet(siteToMakeMarkerFor.coordinate)

      // add site marker
      siteMarkers.push(
        <Marker
          key={`site-marker-${siteToMakeMarkerFor._id}`}
          position={sitePosition}
          zIndexOffset={9000}
        />
      )

      bounds.extend(sitePosition)
    })

    // add all commuters to site
    commuters.forEach((commuter) => {
      if (commuter.coordinate.lat === 0) return  // don't include commuters not geocoded yet
      const commuterPosition = toLeaflet(commuter.coordinate)
      commuterMarkers.push(
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
    if (commuterMarkers.length === 0 && siteMarkers.length === 1) {
      return {
        siteMarkers,
        position: firstSiteCoordinates,
        zoom: 11
      }
    }

    return {
      bounds,
      commuterMarkers,
      siteMarkers
    }
  }

  _onDeleteCommuterClick (commuter) {
    const doDelete = () => this.props.deleteCommuter(commuter)
    actUponConfirmation(messages.commuter.deleteConfirmation, doDelete)
  }

  render () {
    const {commuters, isMultiSite, polygonStore, multiSite, site, sites} = this.props
    const {activeTab, analysisMapStyle, analysisMode, isochroneCutoff, rideMatchMapStyle} = this.state
    const hasCommuters = commuters.length > 0

    /************************************************************************
     map stuff
    ************************************************************************/
    const mapLegendProps = {
      html: '<h4>Legend</h4><table><tbody>',
      position: 'bottomright'
    }

    // add marker to legend
    const siteIconUrl = 'https://unpkg.com/leaflet@1.0.2/dist/images/marker-icon-2x.png'
    mapLegendProps.html += `<tr><td><img src="${siteIconUrl}" style="width: 25px;"/></td><td>Site</td></tr>`

    const {bounds, commuterMarkers, position, siteMarkers, zoom} = this._mapSitesAndCommuters()
    const clusterMarkers = []

    if (hasCommuters) {
      if (rideMatchMapStyle === 'marker-clusters') {
        mapLegendProps.html += `<tr>
          <td>
            <img src="${homeIconUrl}" />
          </td>
          <td>Single Commuter</td>
        </tr>
        <tr>
          <td>
            <img src="${process.env.STATIC_HOST}assets/cluster.png" style="width: 40px;"/>
          </td>
          <td>Cluster of Commuters</td>
        </tr>`

        commuterMarkers.forEach((marker) => {
          clusterMarkers.push({
            id: marker.key,
            latLng: marker.props.position,
            markerOptions: marker.props
          })
        })
      } else {
        mapLegendProps.html += `<tr><td><img src="${homeIconUrl}" /></td><td>Commuter</td></tr>`
      }
    }

    // isochrones
    const isochrones = []
    if (!isMultiSite &&
      activeTab === 'analysis' &&
      site.calculationStatus === 'successfully') {
      // travel times calculated successfully
      const curIsochrones = getIsochrones({
        analysisMapStyle,
        analysisMode,
        isochroneCutoff,
        polygonStore,
        site
      })
      curIsochrones
        .filter((isochrone) => isochrone.properties.time <= isochroneCutoff)
        .forEach((isochrone) => {
          const geojsonProps = {
            data: Object.assign(isochrone, { type: 'Feature' }),
            key: `isochrone-${analysisMapStyle}-${analysisMode}-${isochrone.properties.time}`,
            onEachFeature
          }

          if (isochroneStyleStrategies[analysisMapStyle]) {
            Object.assign(geojsonProps, isochroneStyleStrategies[analysisMapStyle])
          }

          isochrones.push(
            <GeoJSON {...geojsonProps} />
          )
        })

      mapLegendProps.html += getIsochroneLegendHtml({ analysisMapStyle, isochroneCutoff })
    }

    /************************************************************************
     commuter tab stuff
    ************************************************************************/
    const pctGeocoded = formatPercent(commuters.reduce((accumulator, commuter) => {
      return accumulator + (commuter.geocodeConfidence !== -1 ? 1 : 0)
    }, 0) / commuters.length)
    const pctStatsCalculated = formatPercent(commuters.reduce((accumulator, commuter) => {
      return accumulator + (commuter.modeStats ? 1 : 0)
    }, 0) / commuters.length)
    const allCommutersGeocoded = pctGeocoded === 100
    let createCommuterButtons
    if (!isMultiSite) {
      createCommuterButtons = (
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
    }

    /************************************************************************
     analysis tab stuff
    ************************************************************************/
    const analysisModeStatsLookup = {}
    const analysisSliderStepAndMin = (
      getIsochroneStrategies[analysisMapStyle] === '15-minute isochrones'
    ) ? 900 : 300
    commuters.forEach((commuter) => {
      let travelTime
      if (commuter.modeStats) {
        travelTime = commuter.modeStats[analysisMode].travelTime
      } else {
        travelTime = 'calculating...'
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
          bin: (range < 9999
            ? `${minutes - 5} - ${minutes}`
            : (range === 'calculating...' ? range : 'N/A')
          ),
          num,
          cumulative,
          cumulativePct: cumulative / commuters.length
        }
      })

    /************************************************************************
     ridematches tab stuff
    ************************************************************************/
    // TODO: should probably move this computation to a reducer to avoid recalculating on each render
    // only do this if all commuters are geocoded
    let ridematchingAggregateTable = []
    if (allCommutersGeocoded) {
      const matches = []
      for (let i = 0; i < commuters.length; i++) {
        const commuterA = commuters[i]
        const commuterAcoordinates = toCoordinates(commuterA.coordinate)
        for (let j = i + 1; j < commuters.length; j++) {
          const commuterB = commuters[j]
          const commuterBcoordinates = toCoordinates(commuterB.coordinate)
          const distanceBetweenCommuters = distance(commuterAcoordinates, commuterBcoordinates, 'miles')
          if (distanceBetweenCommuters <= 5) {
            matches.push({
              commuterA,
              commuterB,
              distanceBetweenCommuters
            })
          }
        }
      }

      const ridematchingBins = {
        '0 - 0.25': {
          cumulative: 0,
          maxDistance: 0.25,
          num: 0
        },
        '0.25 - 0.5': {
          cumulative: 0,
          maxDistance: 0.5,
          num: 0
        },
        '0.5 - 1': {
          cumulative: 0,
          maxDistance: 1,
          num: 0
        },
        '1 - 2': {
          cumulative: 0,
          maxDistance: 2,
          num: 0
        },
        '2 - 5': {
          cumulative: 0,
          maxDistance: 5,
          num: 0
        },
        'N/A': {}
      }
      const ridematchingBinsArray = Object.keys(ridematchingBins)
      let curBinIdx = 0
      const commutersWithRidematches = {}
      let commutersInCurrentBin = {}
      matches.sort((a, b) => a.distanceBetweenCommuters - b.distanceBetweenCommuters)
        .forEach((match) => {
          // determine current bin
          while (match.distanceBetweenCommuters > (
            ridematchingBins[ridematchingBinsArray[curBinIdx]].maxDistance
          )) {
            curBinIdx++
            ridematchingBins[ridematchingBinsArray[curBinIdx]].cumulative = (
              ridematchingBins[ridematchingBinsArray[curBinIdx - 1]].cumulative
            )
            commutersInCurrentBin = {}
          }

          const binData = ridematchingBins[ridematchingBinsArray[curBinIdx]]

          if (!commutersInCurrentBin[match.commuterA._id]) {
            // first time seeing commuterA in this range, add to total for bin
            binData.num += 1
            commutersInCurrentBin[match.commuterA._id] = true
          }

          if (!commutersInCurrentBin[match.commuterB._id]) {
            // first time seeing commuterB in this range, add to total for bin
            binData.num += 1
            commutersInCurrentBin[match.commuterB._id] = true
          }

          if (!commutersWithRidematches[match.commuterA._id]) {
            // first time seeing commuterA in all matches, add to cumulative total
            binData.cumulative += 1
            commutersWithRidematches[match.commuterA._id] = true
          }

          if (!commutersWithRidematches[match.commuterB._id]) {
            // first time seeing commuterB in all matches, add to cumulative total
            binData.cumulative += 1
            commutersWithRidematches[match.commuterB._id] = true
          }
        })

      // set cumulative of remaining bins (except last)
      while (curBinIdx < ridematchingBinsArray.length - 1) {
        curBinIdx++
        ridematchingBins[ridematchingBinsArray[curBinIdx]].cumulative = (
          ridematchingBins[ridematchingBinsArray[curBinIdx - 1]].cumulative
        )
        ridematchingBins[ridematchingBinsArray[curBinIdx]].cumulativePct = (
          ridematchingBins[ridematchingBinsArray[curBinIdx]].cumulative / commuters.length
        )
      }

      // calculate num commuters without ridematch options
      ridematchingBins['N/A'].num = (
        commuters.length - ridematchingBins[ridematchingBinsArray[ridematchingBinsArray.length - 2]].cumulative
      )
      ridematchingBins['N/A'].cumulative = commuters.length
      ridematchingBins['N/A'].cumulativePct = 1

      ridematchingAggregateTable = ridematchingBinsArray.map((bin) => (
        Object.assign({ bin }, ridematchingBins[bin])
      ))
    }

    mapLegendProps.html += '</tbody></table>'

    return (
      <Grid>
        <Row>
          {/***************************
            Header
          ***************************/}
          <Col xs={12}>
            <h3>
              <span>{isMultiSite ? multiSite.name : site.name}</span>
              <BackButton />
            </h3>
            {!isMultiSite &&
              <p>{site.address}</p>
            }
            <ButtonGroup>
              <ButtonLink
                bsStyle='warning'
                to={`/${isMultiSite ? 'multi-site' : 'site'}/${isMultiSite ? multiSite._id : site._id}/edit`}
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
          <Col xs={12} style={{height: '600px', marginTop: '1em', marginBottom: '1em'}}>
            <LeafletMap center={position} bounds={bounds} zoom={zoom}>
              <TileLayer
                url={Browser.retina &&
                  process.env.LEAFLET_RETINA_URL
                  ? process.env.LEAFLET_RETINA_URL
                  : process.env.LEAFLET_TILE_URL}
                attribution={process.env.LEAFLET_ATTRIBUTION}
                />
              {siteMarkers}
              {rideMatchMapStyle === 'normal' && commuterMarkers}
              {rideMatchMapStyle === 'marker-clusters' &&
                <MarkerCluster
                  newMarkerData={clusterMarkers}
                  />
              }
              {isochrones}
              <Legend {...mapLegendProps} />
            </LeafletMap>
          </Col>
          {/***************************
            Content
          ***************************/}
          {!hasCommuters &&
            <Col xs={12}>
              {isMultiSite &&
                <p>None of the sites in this Multi-Site Analysis have any commuters!  Add commuters to individual sites.</p>
              }
              {!isMultiSite &&
                <div>
                  <p>This site doesn't have any commuters yet!  Add some using one of the options below:</p>
                  {createCommuterButtons}
                </div>
              }
            </Col>
          }
          {hasCommuters &&
            <Tabs
              activeKey={activeTab}
              id='site-tabs'
              onSelect={this._handleTabSelect}
              >
              {isMultiSite &&
                <Tab eventKey='sites' title='Sites'>
                  {/***************************
                    Sites Tab
                  ***************************/}
                  <Row>
                    <Col xs={12}>
                      <BootstrapTable data={sites}>
                        <TableHeaderColumn dataField='_id' isKey hidden />
                        <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='commuters'
                          dataFormat={arrayCountRenderer}
                          >
                          # of Commuters
                        </TableHeaderColumn>
                      </BootstrapTable>
                    </Col>
                  </Row>
                </Tab>
              }
              <Tab eventKey='commuters' title='Commuters'>
                {/***************************
                  Commuters Tab
                ***************************/}
                <Row>
                  <Col xs={12}>
                    {!isMultiSite && createCommuterButtons}
                    {!isMultiSite &&
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
                    }
                    {isMultiSite &&
                      <span className='pull-right'>
                        <Table condensed bordered>
                          <tbody>
                            <tr>
                              <td>% of commuters geocoded:</td>
                              <td>{pctGeocoded}</td>
                              <td>% of commutes calculated:</td>
                              <td>{pctStatsCalculated}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </span>
                    }
                    <div style={{ clear: 'both' }}>
                      {isMultiSite &&
                        <BootstrapTable data={commuters}>
                          <TableHeaderColumn dataField='_id' isKey hidden />
                          <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
                          <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
                          <TableHeaderColumn dataFormat={this._commuterSiteNameRenderer}>Site</TableHeaderColumn>
                        </BootstrapTable>
                      }
                      {!isMultiSite &&
                        <BootstrapTable data={commuters}>
                          <TableHeaderColumn dataField='_id' isKey hidden />
                          <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
                          <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
                          <TableHeaderColumn dataFormat={geocodeConfidenceRenderer}>Geocode Confidence</TableHeaderColumn>
                          <TableHeaderColumn dataFormat={this._commuterToolsRenderer}>Tools</TableHeaderColumn>
                        </BootstrapTable>
                      }
                    </div>
                  </Col>
                </Row>
              </Tab>
              <Tab eventKey='analysis' title='Analysis'>
                {/***************************
                  Analysis Tab
                ***************************/}
                <Panel>
                  <p><b>Maximum Travel Time</b></p>
                  <Slider
                    defaultValue={7200}
                    handle={
                      <CustomHandle
                        formatter={
                          // convert minutes to milliseconds
                          (v) => humanizeDuration(v * 1000, { round: true })
                        }
                        />
                    }
                    marks={{
                      1800: '30 min',
                      3600: '1 hr',
                      5400: '1 hr 30 min',
                      7200: '2 hr'
                    }}
                    max={7200}
                    min={analysisSliderStepAndMin}
                    onChange={this._handleAnalysisTimeChange}
                    step={analysisSliderStepAndMin}
                    />
                </Panel>
                <FieldGroup
                  label='Map Style'
                  name='analysisMapStyle'
                  onChange={this._handleStateChange}
                  componentClass='select'
                  value={analysisMapStyle}
                  >
                  <option value='blue-incremental'>Blueish Isochrone</option>
                  <option value='green-red-diverging'>Green > Yellow > Orange > Red Isochrone</option>
                  <option value='blue-incremental-15-minute'>Blueish Isochrone (15 minute intervals)</option>
                  <option value='blue-solid'>Single Color Isochrone</option>
                  <option value='inverted'>Inverted Isochrone</option>
                </FieldGroup>
                <FieldGroup
                  label='Mode'
                  name='analysisMode'
                  onChange={this._handleStateChange}
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
                  <TableHeaderColumn
                    dataField='cumulativePct'
                    dataFormat={formatPercentAsStr}
                    >
                    Cumulative Percent
                  </TableHeaderColumn>
                </BootstrapTable>
              </Tab>
              <Tab eventKey='ridematches' title='Ridematches'>
                {/***************************
                  Ridematches Tab
                ***************************/}
                {!allCommutersGeocoded &&
                  <ProgressBar
                    striped
                    now={pctGeocoded}
                    label='Geocoding Commuters'
                    />
                }
                {allCommutersGeocoded &&
                  <div>
                    <FieldGroup
                      label='Map Style'
                      name='rideMatchMapStyle'
                      onChange={this._handleStateChange}
                      componentClass='select'
                      value={rideMatchMapStyle}
                      >
                      <option value='normal'>Normal</option>
                      <option value='marker-clusters'>Clusters</option>
                      <option value='heatmap'>Heatmap</option>
                    </FieldGroup>
                    <BootstrapTable data={ridematchingAggregateTable}>
                      <TableHeaderColumn dataField='bin' isKey>Ridematch radius in miles</TableHeaderColumn>
                      <TableHeaderColumn dataField='num'>Number in Range</TableHeaderColumn>
                      <TableHeaderColumn dataField='cumulative'>Cumulative Number</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='cumulativePct'
                        dataFormat={formatPercentAsStr}
                        >
                        Cumulative Percent
                      </TableHeaderColumn>
                    </BootstrapTable>
                  </div>
                }
              </Tab>
            </Tabs>
          }
        </Row>
      </Grid>
    )
  }
}

function CustomHandle (props) {
  const style = Object.assign({ left: `${props.offset}%` }, handleStyle)
  return (
    <div style={style}>{props.formatter(props.value)}</div>
  )
}

CustomHandle.propTypes = {
  formatter: PropTypes.func.isRequired,
  offset: PropTypes.number,
  value: PropTypes.any
}

const fillColor = {
  'blue-incremental': (time) => hslToHex(240, 100, time * 0.00942 + 27.1739),
  'blue-incremental-15-minute': (time) => hslToHex(240, 100, Math.floor(time / 900) * 8.125 + 30),
  'blue-solid': '#000099',
  'green-red-diverging': (time) => hslToHex(time * -0.017391304347826 + 125.217391304348, 100, 50),
  'inverted': '#000099'
}

function formatPercent (n) {
  return Math.round(n * 100)
}

function formatPercentAsStr (n) {
  return `${formatPercent(n)}%`
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

function getIsochroneLegendHtml ({ analysisMapStyle, isochroneCutoff }) {
  let html = '<tr><td colspan="2">Travel Time</td></tr>'
  const strategy = getIsochroneStrategies[analysisMapStyle]

  if (strategy === 'single isochrone') {
    html += `<tr>
      <td>
        <div style="border: 1px solid black;">
          <div style="background-color: ${fillColor[analysisMapStyle]}; opacity: 0.4;">
            &nbsp;
          </div>
        </div>
      </td>
      <td>0 - ${shortEnglishHumanizer(isochroneCutoff * 1000)}</td>
    </tr>`
  } else if (strategy === 'inverted isochrone') {
    html += `<tr>
      <td><div style="border: 3px solid #3388FF;">&nbsp;</div></td>
      <td>0 - ${shortEnglishHumanizer(isochroneCutoff * 1000)}</td>
    </tr>`
  } else {
    const timeGap = 900

    for (let curTime = timeGap; curTime <= 7200; curTime += timeGap) {
      html += `<tr>
        <td style="background-color: ${fillColor[analysisMapStyle](curTime)}; opacity: 0.4;"></td>
        <td>${shortEnglishHumanizer((curTime - timeGap) * 1000)} - ${shortEnglishHumanizer(curTime * 1000)}</td>
      </tr>`
    }
  }
  return html
}

const getIsochroneCache = {}

function getIsochrones ({ analysisMapStyle, analysisMode, isochroneCutoff, polygonStore, site }) {
  const strategy = getIsochroneStrategies[analysisMapStyle]
  const cacheQuery = [
    site.coordinate.lat,
    site.coordinate.lng,
    analysisMode,
    strategy === strategy.indexOf('minute') > -1 ? strategy : `${strategy}-${isochroneCutoff}`
  ].join('-')
  if (getIsochroneCache[cacheQuery]) {
    return getIsochroneCache[cacheQuery]
  }

  const allPolygons = Object.values(polygonStore)

  // single extent isochrone
  if (strategy.indexOf('minute') === -1) {
    // diff isochrones to get 5 minute isochrones
    for (let i = 0; i < allPolygons.length; i++) {
      const curPolygon = allPolygons[i]
      if (curPolygon.mode === analysisMode &&
        curPolygon.siteId === site._id &&
        curPolygon.properties.time === isochroneCutoff) {
        if (strategy === 'single isochrone') {
          getIsochroneCache[cacheQuery] = [curPolygon]
          return [curPolygon]
        } else if (strategy === 'inverted isochrone') {
          // diff against massive polygon
          const hugePolygon = {
            coordinates: [[
              [-179.9999, -89.9999],
              [-179.9999, 89.9999],
              [179.9999, 89.9999],
              [179.9999, -89.9999],
              [-179.9999, -89.9999]
            ]],
            type: 'Polygon'
          }
          const hugePolygonGeometry = geoJsonReader.read(JSON.stringify(hugePolygon))
          const invertedGeom = hugePolygonGeometry.difference(reduceAndSimplifyGeometry(curPolygon.geometry))
          const invertedIsochrone = {
            geometry: geoJsonWriter.write(invertedGeom),
            properties: curPolygon.properties,
            type: 'Feature'
          }
          getIsochroneCache[cacheQuery] = [invertedIsochrone]
          return [invertedIsochrone]
        }
      }
    }
    // no match found
    return []
  }

  const sitePolygons = allPolygons
    .filter((polygon) => polygon.mode === analysisMode && polygon.siteId === site._id)
    .sort((a, b) => a.properties.time - b.properties.time)

  let timeGap = 900
  if (strategy === '5-minute isochrones') {
    timeGap = 300
  }

  // diff isochrones to get desired isochrones
  const isochrones = []
  let traversedIsochrone
  sitePolygons
    .filter((polygon) => polygon.properties.time % timeGap === 0)
    .forEach((polygon) => {
      const curFeatureGeometry = reduceAndSimplifyGeometry(polygon.geometry)
      let isochroneGeometry

      if (!traversedIsochrone) {
        isochroneGeometry = curFeatureGeometry
      } else {
        isochroneGeometry = curFeatureGeometry.difference(traversedIsochrone)
      }

      isochrones.push({
        geometry: geoJsonWriter.write(isochroneGeometry),
        properties: polygon.properties,
        type: 'Feature'
      })
      traversedIsochrone = curFeatureGeometry
    })

  getIsochroneCache[cacheQuery] = isochrones
  return isochrones
}

const getIsochroneStrategies = {
  'blue-incremental': '5-minute isochrones',
  'blue-incremental-15-minute': '15-minute isochrones',
  'blue-solid': 'single isochrone',
  'green-red-diverging': '5-minute isochrones',
  'inverted': 'inverted isochrone'
}

const handleStyle = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  cursor: 'pointer',
  padding: '2px',
  border: '2px solid #abe2fb',
  borderRadius: '3px',
  background: '#fff',
  fontSize: '14px',
  textAlign: 'center'
}

const homeIconUrl = `${process.env.STATIC_HOST}assets/home-2.png`
const homeIcon = icon({
  iconUrl: homeIconUrl,
  iconSize: [32, 37],
  iconAnchor: [22, 37]
})

const isochroneStyleStrategies = {
  'blue-incremental': {
    fillOpacity: 0.4,
    stroke: false,
    style: (feature) => {
      return {
        fillColor: fillColor['blue-incremental'](feature.properties.time)
      }
    }
  },
  'blue-incremental-15-minute': {
    color: '#000000',
    fillOpacity: 0.4,
    stroke: true,
    style: (feature) => {
      return {
        fillColor: fillColor['blue-incremental'](feature.properties.time)
      }
    },
    weight: 1
  },
  'blue-solid': {
    color: '#000000',
    fillColor: fillColor['blue-solid'],
    fillOpacity: 0.4,
    stroke: true,
    weight: 1
  },
  'green-red-diverging': {
    fillOpacity: 0.4,
    stroke: false,
    style: (feature) => {
      return {
        fillColor: fillColor['green-red-diverging'](feature.properties.time)
      }
    }
  }
}

function onEachFeature (feature, layer) {
  if (feature.properties) {
    let pop = '<p>'
    Object.keys(feature.properties).forEach((name) => {
      const val = feature.properties[name]
      pop += name.toUpperCase()
      pop += ': '
      pop += name.toUpperCase() === 'TIME' ? humanizeDuration(val * 1000) : val
      pop += '<br />'
    })
    pop += '</p>'
    layer.bindPopup(pop)
  }
}

function reduceAndSimplifyGeometry (inputGeomerty) {
  const geometry = geoJsonReader.read(JSON.stringify(inputGeomerty))
  const precisionModel = new geom.PrecisionModel(10000)
  const precisionReducer = new precision.GeometryPrecisionReducer(precisionModel)
  return precisionReducer.reduce(simplify.DouglasPeuckerSimplifier.simplify(geometry, 0.001))
}

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms'
    }
  },
  spacer: ''
})
