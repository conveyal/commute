import hslToHex from 'colorvert/hsl/hex'
import {toCoordinates, toLeaflet} from '@conveyal/lonlat'
import humanizeDuration from 'humanize-duration'
import {geom, io, precision, simplify} from 'jsts'
import {Browser, icon, latLngBounds, point} from 'leaflet'
import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, ControlLabel, FormGroup, Grid, Panel,
  ProgressBar, Row, Tab, Table, Tabs} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Circle, GeoJSON, Map as LeafletMap, Marker, Popup, TileLayer} from 'react-leaflet'
import Heatmap from 'react-leaflet-heatmap-layer'
import Combobox from 'react-widgets/lib/Combobox'
import Slider from 'rc-slider'
import distance from '@turf/distance'

import BackButton from '../containers/back-button'
import ButtonLink from './button-link'
import FieldGroup from './fieldgroup'
import Icon from './icon'
import Legend from './legend'
import MarkerCluster from './marker-cluster'
import {actUponConfirmation, arrayCountRenderer, humanizeDistance} from '../utils'
import messages from '../utils/messages'

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
      activeTab: 'summary',
      analysisMode: 'TRANSIT',
      analysisMapStyle: 'blue-solid',
      commuterRingRadius: 1,
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

  _handleRidematchRadiusChange = (value) => {
    this.setState({ commuterRingRadius: value })
  }

  _handleSelectCommuter = (commuter, fromMap) => {
    const newState = { selectedCommuter: commuter }
    if (fromMap) {
      newState.activeTab = 'individual-analysis'
    }
    this.setState(newState)
  }

  _handleStateChange = (name, event) => {
    this.setState({ [name]: event.target.value })
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
      const numCommutersInSites = sites.reduce((accumulator, currentSite) => {
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
    if (site &&
      site.calculationStatus === 'successfully' &&
      !Object.values(polygonStore)
        .some((isochrone) => isochrone.siteId === site._id)) {
      // if 0 polygons exist for site, assume they need to be fetched
      loadPolygons({ siteId: site._id })
    }
  }

  _mapSitesAndCommuters = () => {
    const {commuters, isMultiSite, site, sites} = this.props
    const {selectedCommuter} = this.state
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
      const isSelectedCommuter = selectedCommuter && selectedCommuter._id === commuter._id
      commuterMarkers.push(
        <Marker
          icon={isSelectedCommuter ? homeIconSelected : homeIcon}
          key={`commuter-marker-${commuter._id}`}
          onClick={() => this._handleSelectCommuter(commuter, true)}
          position={commuterPosition}
          zIndexOffset={1234}
          >
          <Popup
            offset={homeIconSelectedOffset}
            >
            <h4>{commuter.name}</h4>
          </Popup>
        </Marker>
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
    const {commuters, isMultiSite, polygonStore, multiSite, site, sites, siteStore} = this.props
    const {
      activeTab,
      analysisMapStyle,
      analysisMode,
      commuterRingRadius,
      isochroneCutoff,
      rideMatchMapStyle,
      selectedCommuter
    } = this.state

    const hasCommuters = commuters.length > 0
    const pctGeocoded = formatPercent(commuters.reduce((accumulator, commuter) => {
      return accumulator + (commuter.geocodeConfidence !== -1 ? 1 : 0)
    }, 0) / commuters.length)
    const pctStatsCalculated = formatPercent(commuters.reduce((accumulator, commuter) => {
      return accumulator + (commuter.modeStats ? 1 : 0)
    }, 0) / commuters.length)
    const allCommutersGeocoded = pctGeocoded === 100
    const allCommutersStatsCalculated = pctStatsCalculated === 100

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
    const commuterRings = []

    if (hasCommuters) {
      if (activeTab === 'ridematches') {
        if (rideMatchMapStyle === 'normal') {
          mapLegendProps.html += `<tr><td><img src="${homeIconUrl}" /></td><td>Commuter</td></tr>`
        } else if (rideMatchMapStyle === 'marker-clusters') {
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
              markerOptions: marker.props,
              onClick: marker.props.onClick
            })
          })
        } else if (rideMatchMapStyle === 'heatmap') {
          mapLegendProps.html += `<tr>
            <td
              rowspan="2"
              style="background-image: url(${process.env.STATIC_HOST}assets/heatmap-gradient.png);
                background-size: contain;"
              />
            <td>Less Commuters</td>
          </tr>
          <tr>
            <td>More Commuters</td>
          </tr>`
        } else if (rideMatchMapStyle === 'commuter-rings') {
          mapLegendProps.html += `<tr>
            <td>
              <img src="${homeIconUrl}" />
            </td>
            <td>Commuter</td>
          </tr>
          <tr>
            <td>
              <div style="border: 3px solid #3388ff; border-radius: 20px; overflow: hidden;">
                <div style="background-color: #3388ff; opacity: 0.2; height: 25px;">
                  &nbsp;
                </div>
              </div>
            </td>
            <td>${humanizeDistance(commuterRingRadius, 2)} Radius</td>
          </tr>`

          const meters = commuterRingRadius * 1609.34

          commuterMarkers.forEach((marker) => {
            commuterRings.push(
              <Circle
                center={marker.props.position}
                key={`commuter-circle-${marker.key}`}
                radius={meters}
                />
            )
          })
        }
      } else {
        mapLegendProps.html += `<tr><td><img src="${homeIconUrl}" /></td><td>Commuter</td></tr>`
      }
    }

    if ((!(activeTab === 'ridematches') || (
      activeTab === 'ridematches' && rideMatchMapStyle !== 'heatmap'
    )) && selectedCommuter) {
      mapLegendProps.html += `<tr>
        <td>
          <img src="${homeIconSelectedUrl}" />
        </td>
        <td>${selectedCommuter.name}</td>
      </tr>`
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

      mapLegendProps.html += getIsochroneLegendHtml({ analysisMapStyle, isochroneCutoff, analysisMode })
    }

    /************************************************************************
     summary tab stuff
    ************************************************************************/

    const summaryStats = {}

    if (allCommutersStatsCalculated) {
      let numWith60MinTransit = 0
      summaryStats.numWith20MinWalk = 0
      let numWith30MinBike = 0
      commuters.forEach((commuter) => {
        if (commuter.modeStats.TRANSIT.travelTime > -1 &&
          commuter.modeStats.TRANSIT.travelTime <= 3600) {
          numWith60MinTransit++
        }

        if (commuter.modeStats.BICYCLE.travelTime > -1 &&
          commuter.modeStats.BICYCLE.travelTime <= 1800) {
          numWith30MinBike++
        }
      })

      summaryStats.pctWith60MinTransit = formatPercentAsStr(numWith60MinTransit / commuters.length)
      summaryStats.pctWith30MinBike = formatPercentAsStr(numWith30MinBike / commuters.length)
    }

    /************************************************************************
     commuter tab stuff
    ************************************************************************/
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
      // skip uncreachables
      if (travelTime === -1) {
        return
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
          bin: (range === 'calculating...'
            ? range
            : `< ${humanizeDuration(minutes * 60 * 1000)}`
          ),
          num,
          cumulative,
          cumulativePct: cumulative / commuters.length
        }
      })

    /************************************************************************
     ridematches tab stuff
    ************************************************************************/
    // only do this if all commuters are geocoded
    const ridematches = {}
    const ridematchingAggregateTable = []

    const addRidematch = (commuterA, commuterB, distance) => {
      if (!ridematches[commuterA._id]) {
        ridematches[commuterA._id] = {
          matches: [],
          minDistance: distance
        }
      }
      ridematches[commuterA._id].matches.push({
        commuter: commuterB,
        distance
      })
      if (ridematches[commuterA._id].minDistance > distance) {
        ridematches[commuterA._id].minDistance = distance
      }
    }

    if (allCommutersGeocoded) {
      for (let i = 0; i < commuters.length; i++) {
        const commuterA = commuters[i]
        const commuterAcoordinates = toCoordinates(commuterA.coordinate)
        for (let j = i + 1; j < commuters.length; j++) {
          const commuterB = commuters[j]
          const commuterBcoordinates = toCoordinates(commuterB.coordinate)
          const distanceBetweenCommuters = distance(commuterAcoordinates, commuterBcoordinates, 'miles')
          if (distanceBetweenCommuters <= 5) {
            addRidematch(commuterA, commuterB, distanceBetweenCommuters)
            addRidematch(commuterB, commuterA, distanceBetweenCommuters)
          }
        }
      }

      const ridematchingBinsByMaxDistance = [0.25, 0.5, 1, 2, 5]
      const ridematchingBinLabels = [
        '< 1/4 mile',
        '< 1/2 mile',
        '< 1 mile',
        '< 2 miles',
        '< 5 miles',
        '5 miles+'
      ]
      const ridematchingBinVals = [0, 0, 0, 0, 0, 0]

      // tally up how many are in each bin
      commuters.forEach((commuter) => {
        const match = ridematches[commuter._id]
        if (match) {
          let binIdx = 0
          while (binIdx < ridematchingBinsByMaxDistance.length &&
            match.minDistance > ridematchingBinsByMaxDistance[binIdx]) {
            binIdx++
          }
          ridematchingBinVals[binIdx]++
        } else {
          ridematchingBinVals[ridematchingBinVals.length - 1]++
        }
      })

      let cumulativeNum = 0
      ridematchingBinLabels.forEach((label, idx) => {
        const numInBin = ridematchingBinVals[idx]
        ridematchingAggregateTable.push({
          bin: label,
          cumulative: cumulativeNum + numInBin,
          cumulativePct: (cumulativeNum + numInBin) / commuters.length,
          num: numInBin
        })

        cumulativeNum += numInBin
      })

      const upToOneMileBinIdx = 2
      summaryStats.pctWithRidematch = formatPercentAsStr(ridematchingAggregateTable[upToOneMileBinIdx].cumulativePct)
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
            <LeafletMap
              center={position}
              bounds={bounds}
              zoom={zoom}
              >
              <TileLayer
                url={Browser.retina &&
                  process.env.LEAFLET_RETINA_URL
                  ? process.env.LEAFLET_RETINA_URL
                  : process.env.LEAFLET_TILE_URL}
                attribution={process.env.LEAFLET_ATTRIBUTION}
                />
              {siteMarkers}
              {activeTab !== 'ridematches' && commuterMarkers}
              {activeTab === 'ridematches' && rideMatchMapStyle === 'normal' &&
                commuterMarkers}
              {activeTab === 'ridematches' && rideMatchMapStyle === 'marker-clusters' &&
                <MarkerCluster
                  newMarkerData={clusterMarkers}
                  />
              }
              {activeTab === 'ridematches' && rideMatchMapStyle === 'heatmap' &&
                <Heatmap
                  intensityExtractor={m => 1000}
                  latitudeExtractor={m => m.props.position.lat}
                  longitudeExtractor={m => m.props.position.lng}
                  points={commuterMarkers}
                  />
              }
              {activeTab === 'ridematches' && rideMatchMapStyle === 'commuter-rings' &&
                commuterRings}
              {activeTab === 'ridematches' && rideMatchMapStyle === 'commuter-rings' &&
                commuterMarkers}
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
                <p>None of the sites in this Multi-Site Analysis have any commuters!  Add commuters to specific sites.</p>
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
              <Tab eventKey='summary' title='Summary'>
                {/***************************
                  Summary Tab
                ***************************/}
                {!allCommutersGeocoded &&
                  <ProgressBar
                    striped
                    now={pctGeocoded}
                    label='Geocoding Commuters'
                    />
                }
                {allCommutersGeocoded && !allCommutersStatsCalculated &&
                  <ProgressBar
                    striped
                    now={pctStatsCalculated}
                    label='Analyzing Commutes'
                    />
                }
                {allCommutersGeocoded && allCommutersStatsCalculated &&
                  <Row>
                    <Col xs={12} sm={3}>
                      <h4>Total Commuters</h4>
                      <div className='infographic-well' style={{backgroundColor: '#51992e'}}>
                        <Icon type='group' />
                        <span className='number'>{commuters.length}</span>
                      </div>
                      <p>
                        {commuters.length}
                        {isMultiSite
                          ? ' commuters are at these sites.'
                          : ' commuters are at this site.'}</p>
                    </Col>
                    <Col xs={12} sm={3}>
                      <h4>Transit Commute</h4>
                      <div
                        className='infographic-well'
                        style={infographicBackground('#3b90c6', summaryStats.pctWith60MinTransit)}
                        >
                        <Icon type='bus' />
                        <span className='number-pct'>{summaryStats.pctWith60MinTransit}</span>
                      </div>
                      <p>
                        {summaryStats.pctWith60MinTransit} of commuters at
                        {isMultiSite ? ' these sites ' : ' this site '}
                        are within a 60 minute transit ride.
                      </p>
                    </Col>
                    <Col xs={12} sm={3}>
                      <h4>Bike Commute</h4>
                      <div
                        className='infographic-well'
                        style={infographicBackground('#f0a800', summaryStats.pctWith30MinBike)}
                        >
                        <Icon type='bicycle' />
                        <span className='number-pct'>{summaryStats.pctWith30MinBike}</span>
                      </div>
                      <p>
                        {summaryStats.pctWith30MinBike} of commuters at
                        {isMultiSite ? ' these sites ' : ' this site '}
                        can bike to work in 30 minutes or less.
                      </p>
                    </Col>
                    <Col xs={12} sm={3}>
                      <h4>Rideshare Commute</h4>
                      <div
                        className='infographic-well'
                        style={infographicBackground('#ec684f', summaryStats.pctWithRidematch)}
                        >
                        <i className='icon-carshare' />
                        <span className='number-pct'>{summaryStats.pctWithRidematch}</span>
                      </div>
                      <p>
                        {summaryStats.pctWith30MinBike} of commuters at
                        {isMultiSite ? ' these sites ' : ' this site '}
                        have a rideshare match within 1 mile or less of their homes.
                      </p>
                    </Col>
                  </Row>
                }
              </Tab>
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
                        <BootstrapTable
                          data={commuters}
                          pagination={commuters.length > 10}
                          >
                          <TableHeaderColumn dataField='_id' isKey hidden />
                          <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
                          <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
                          <TableHeaderColumn dataFormat={this._commuterSiteNameRenderer}>Site</TableHeaderColumn>
                        </BootstrapTable>
                      }
                      {!isMultiSite &&
                        <BootstrapTable
                          data={commuters}
                          pagination={commuters.length > 10}
                          >
                          <TableHeaderColumn dataField='_id' isKey hidden />
                          <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
                          <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
                          <TableHeaderColumn dataFormat={geocodeConfidenceRenderer}>Geocode Accuracy</TableHeaderColumn>
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
                {!isMultiSite &&
                  <div>
                    <FieldGroup
                      label='Map Style'
                      name='analysisMapStyle'
                      onChange={this._handleStateChange}
                      componentClass='select'
                      value={analysisMapStyle}
                      >
                      <option value='blue-solid'>Single Color Isochrone</option>
                      <option value='inverted'>Inverted Isochrone</option>
                      <option value='blue-incremental-15-minute'>Blueish Isochrone (15 minute intervals)</option>
                      <option value='blue-incremental'>Blueish Isochrone (5 minute intervals)</option>
                      <option value='green-red-diverging'>Green > Yellow > Orange > Red Isochrone (5 minute intervals)</option>
                    </FieldGroup>
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
                        max={7200}
                        min={analysisSliderStepAndMin}
                        onChange={this._handleAnalysisTimeChange}
                        step={analysisSliderStepAndMin}
                        />
                    </Panel>
                  </div>
                }
                <h4>Commuter Travel Time Summary ({capitalize(analysisMode.toLowerCase())})</h4>
                <p>
                  This table provides a summary of the distribution of travel times to work.
                  Each row shows how many commuters can commute to work using the currently
                  selected mode up to the travel time listed.
                </p>
                <BootstrapTable data={analysisModeStats}>
                  <TableHeaderColumn dataField='bin' isKey>Travel Time to Work (minutes)</TableHeaderColumn>
                  <TableHeaderColumn dataField='cumulative'>Number of Commuters</TableHeaderColumn>
                  <TableHeaderColumn
                    dataField='cumulativePct'
                    dataFormat={formatPercentAsStr}
                    >
                    Percent of Commuters
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
                      <option value='commuter-rings'>Commuter Rings</option>
                    </FieldGroup>
                    {rideMatchMapStyle === 'commuter-rings' &&
                      <Panel>
                        <p><b>Commuter Ring Size</b></p>
                        <Slider
                          defaultValue={1}
                          handle={
                            <CustomHandle
                              formatter={
                                // convert minutes to milliseconds
                                (v) => humanizeDistance(v)
                              }
                              />
                          }
                          max={20}
                          min={0.25}
                          onChange={this._handleRidematchRadiusChange}
                          step={0.25}
                          />
                      </Panel>
                    }
                    <h4>Ridematch Summary</h4>
                    <p>
                      This table provides a summary of the distribution of commuter ridematches.
                      Each row shows how many commuters have another commuter located within the
                      current distance listed (as the crow flies).
                    </p>
                    <BootstrapTable data={ridematchingAggregateTable}>
                      <TableHeaderColumn dataField='bin' isKey>Ridematch radius (miles)</TableHeaderColumn>
                      <TableHeaderColumn dataField='cumulative'>Number of Commuters</TableHeaderColumn>
                      <TableHeaderColumn
                        dataField='cumulativePct'
                        dataFormat={formatPercentAsStr}
                        >
                        Percent of Commuters
                      </TableHeaderColumn>
                    </BootstrapTable>
                  </div>
                }
              </Tab>
              <Tab eventKey='individual-analysis' title='Individual'>
                {/***************************
                  Individual Analysis Tab
                ***************************/}
                <FormGroup
                  controlId={`individual-commuter-name`}
                  >
                  <ControlLabel>Commuter</ControlLabel>
                  <Combobox
                    data={commuters}
                    onChange={this._handleSelectCommuter}
                    placeholder='Select a commuter'
                    suggest
                    textField='name'
                    value={selectedCommuter}
                    valueField='_id'
                    />
                </FormGroup>
                {selectedCommuter &&
                  <Button onClick={() => this._handleSelectCommuter()}>
                    <Icon type='close' />
                    <span>Deselect commuter</span>
                  </Button>
                }
                {selectedCommuter &&
                  <Row>
                    <Col xs={12}>
                      <h4>{selectedCommuter.name}</h4>
                    </Col>
                    <Col xs={12} sm={6}>
                      <h5>Location</h5>
                      <table className='table table-bordered'>
                        <tbody>
                          {isMultiSite &&
                            <tr key='selectedCommuterTableSiteRow'>
                              <td>Site</td>
                              <td>{siteStore[selectedCommuter.siteId].name}</td>
                            </tr>
                          }
                          {['address', 'neighborhood', 'city', 'county', 'state']
                            .map((field) => (
                              <tr key={`selectedCommuterTable${field}Row`}>
                                <td>{capitalize(field)}</td>
                                <td>{selectedCommuter[field]}</td>
                              </tr>
                            ))
                          }
                          <tr key='selectedCommuterTableGeocodeConfidenceRow'>
                            <td>Geocode Accuracy</td>
                            <td>{geocodeConfidenceRenderer(null, selectedCommuter)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                    <Col xs={12} sm={6}>
                      <h5>Commuting Options</h5>
                      <table className='table table-bordered'>
                        <tbody>
                          {['bicycle', 'car', 'transit', 'walk']
                            .map((mode) => (
                              <tr key={`selectedCommuterTable${mode}Row`}>
                                <td>{capitalize(mode)}</td>
                                <td>
                                  {
                                    getTravelTime(selectedCommuter.modeStats[mode.toUpperCase()]) +
                                    (mode === 'car' ? ' (without traffic)' : '')
                                  }
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </Col>
                    <Col xs={12} sm={6}>
                      <h5>Ridematches</h5>
                      {!ridematches[selectedCommuter._id] &&
                        <p>No ridematches within 5 miles of this commuter</p>
                      }
                      {ridematches[selectedCommuter._id] &&
                        <div>
                          <p>{`${ridematches[selectedCommuter._id].matches.length} total matches`}</p>
                          <BootstrapTable
                            data={ridematches[selectedCommuter._id].matches
                              .map((match) => {
                                return {
                                  distance: match.distance,
                                  id: match.commuter._id,
                                  name: match.commuter.name
                                }
                              })}
                            options={{
                              defaultSortName: 'distance',
                              defaultSortOrder: 'asc'
                            }}
                            pagination={ridematches[selectedCommuter._id].matches.length > 10}
                            >
                            <TableHeaderColumn dataField='id' isKey hidden />
                            <TableHeaderColumn dataField='name' dataSort>Matched Commuter</TableHeaderColumn>
                            <TableHeaderColumn
                              dataField='distance'
                              dataFormat={formatDistance}
                              dataSort
                              >
                              Distance Between Commuters
                            </TableHeaderColumn>
                          </BootstrapTable>
                        </div>
                      }
                    </Col>
                  </Row>
                }
              </Tab>
            </Tabs>
          }
        </Row>
      </Grid>
    )
  }
}

function capitalize (s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
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

function formatDistance (cell, row) {
  return humanizeDistance(cell)
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

function getIsochroneLegendHtml ({ analysisMapStyle, isochroneCutoff, analysisMode }) {
  let html = `<tr><td colspan="2">Travel Time (by ${capitalize(analysisMode.toLowerCase())})</td></tr>`
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

function getTravelTime (mode) {
  if (!mode || !mode.travelTime || mode.travelTime === -1 || mode.travelTime > 7200) {
    return 'N/A'
  } else {
    return humanizeDuration(mode.travelTime * 1000)
  }
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
  iconAnchor: [16, 37]
})

const homeIconSelectedUrl = `${process.env.STATIC_HOST}assets/home-2-selected.png`
const homeIconSelected = icon({
  iconUrl: homeIconSelectedUrl,
  iconSize: [32, 37],
  iconAnchor: [16, 37]
})
const homeIconSelectedOffset = point(0, -20)

function infographicBackground (color, pct) {
  return {
    background: `linear-gradient(to right,
      ${color} 0%,
      ${color} ${pct},
      #b1b3af ${pct},
      #b1b3af 100%)`
  }
}

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
