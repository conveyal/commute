import humanizeDuration from 'humanize-duration'
import React, {Component, PropTypes} from 'react'
import {Button, ButtonGroup, Col, ControlLabel, FormGroup, Grid, Panel,
  ProgressBar, Row, Tab, Table, Tabs} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Combobox from 'react-widgets/lib/Combobox'
import Slider from 'rc-slider'

import BackButton from '../containers/back-button'
import ButtonLink from './button-link'
import FieldGroup from './fieldgroup'
import Icon from './icon'
import {actUponConfirmation, arrayCountRenderer, humanizeDistance,
  formatDistance, formatPercent, formatPercentAsStr} from '../utils'
import {pageview} from '../utils/analytics'
import messages from '../utils/messages'
import SiteMap from './site-map'
import SiteInfographic from './site-infographic'

import { processSite, downloadMatches } from './site-common'

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
      rideMatchMapStyle: 'normal',
      mapDisplayMode: 'STANDARD' // STANDARD / FULLSCREEN / HIDDEN
    }
    this._loadDataIfNeeded(this.props)
    const {isMultiSite} = this.props
    if (isMultiSite) {
      pageview('/multi-site')
    } else {
      pageview('/site')
    }
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
        bsSize='xsmall'
        bsStyle='warning'
        to={`/site/${site._id}/commuter/${row._id}/edit`}>
        <Icon type='pencil' />Edit
      </ButtonLink>
      <Button
        bsSize='xsmall'
        bsStyle='danger'
        onClick={this._onDeleteCommuterClick.bind(this, row)}>
        <Icon type='trash' /> Delete
      </Button>
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

  _setMapDisplayMode (mapDisplayMode) {
    this.setState({ mapDisplayMode })
    setTimeout(() => {
      this.refs['map'].resized()
    }, 100)
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
      selectedCommuter,
      mapDisplayMode
    } = this.state

    const hasCommuters = commuters.length > 0

    const processed = processSite(commuters, analysisMode)

    /* const pctGeocoded = formatPercent(commuters.reduce((accumulator, commuter) => {
      return accumulator + (commuter.geocodeConfidence !== -1 ? 1 : 0)
    }, 0) / commuters.length)
    const pctStatsCalculated = formatPercent(commuters.reduce((accumulator, commuter) => {
      return accumulator + (commuter.modeStats ? 1 : 0)
    }, 0) / commuters.length)
    const allCommutersGeocoded = pctGeocoded === 100
    const allCommutersStatsCalculated = pctStatsCalculated === 100 */

    /************************************************************************
     summary tab stuff
    ************************************************************************/

    /* const summaryStats = {}

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
    } */

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

    const analysisSliderStepAndMin = (
      getIsochroneStrategies[analysisMapStyle] === '15-minute isochrones'
    ) ? 900 : 300

    /* const analysisModeStatsLookup = {}
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
      }) */

    /************************************************************************
     ridematches tab stuff
    ************************************************************************/
    // only do this if all commuters are geocoded
    /* const ridematches = {}
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
    } */

    return (
      <Grid>
        <Row>
          {/***************************
            Header
          ***************************/}
          <Col xs={12}>
            <h3>
              <Icon type='building' />{' '}
              <span>{isMultiSite ? multiSite.name : site.name}</span>
              {' '}
              <ButtonGroup style={{ marginLeft: '12px', paddingBottom: '2px' }}>
                <ButtonLink
                  bsSize='xsmall'
                  bsStyle='warning'
                  to={`/${isMultiSite ? 'multi-site' : 'site'}/${isMultiSite ? multiSite._id : site._id}/edit`}
                  >
                  <Icon type='pencil' /> Edit
                </ButtonLink>
                <Button
                  bsSize='xsmall'
                  bsStyle='danger'
                  onClick={this._handleDelete}
                  >
                  <Icon type='trash' /> Delete
                </Button>
              </ButtonGroup>
              <BackButton />
            </h3>
            {!isMultiSite &&
              <p><Icon type='map-marker' /> {site.address}</p>
            }
          </Col>
        </Row>

        <Row style={{ marginTop: '15px' }}>
          {/***************************
            Content
          ***************************/}
          {!hasCommuters &&
            <Col xs={this.state.mapDisplayMode === 'HIDDEN' ? 12 : 7}>
              {isMultiSite &&
                <p>None of the sites in this Multi-Site Analysis have any commuters!  Add commuters to specific sites.</p>
              }
              {!isMultiSite &&
                <div>
                  <p>This site doesn{`'`}t have any commuters yet!  Add some using one of the options below:</p>
                  {createCommuterButtons}
                </div>
              }
            </Col>
          }
          {hasCommuters &&
            <Col xs={this.state.mapDisplayMode === 'HIDDEN' ? 12 : 7}>
              <Tabs
                activeKey={activeTab}
                id='site-tabs'
                onSelect={this._handleTabSelect}
                >
                {this.state.mapDisplayMode === 'HIDDEN' &&
                  <div style={{ position: 'absolute', right: '15px', top: '0px' }}>
                    <Button bsSize='small' onClick={() => this.setState({ mapDisplayMode: 'STANDARD' })}>
                      <Icon type='map' /> Show Map
                    </Button>
                  </div>
                }
                <Tab eventKey='summary' title={<span><Icon type='info-circle' /> Summary</span>}>
                  {/***************************
                    Summary Tab
                  ***************************/}
                  {!processed.allCommutersGeocoded &&
                    <ProgressBar
                      striped
                      now={processed.pctGeocoded}
                      label='Geocoding Commuters'
                      />
                  }
                  {processed.allCommutersGeocoded && !processed.allCommutersStatsCalculated &&
                    <ProgressBar
                      striped
                      now={processed.pctStatsCalculated}
                      label='Analyzing Commutes'
                      />
                  }
                  {processed.allCommutersGeocoded && processed.allCommutersStatsCalculated &&

                    <Row className='summary-tab'>
                      <Row>
                        <Col xs={12}>
                          <Panel header={(<h3>Printable Report</h3>)}>
                            <Col xs={5}>
                              <ButtonLink
                                bsStyle='primary'
                                bsSize='large'
                                to={`/site/${site._id}/report`}>
                                <Icon type='print' />View Printable Report
                              </ButtonLink>
                            </Col>
                            <Col xs={7}>
                              <Icon type='info-circle' /> Click "View Printable Report" to view a summary version of this site analysis suitable for sharing with partners.
                            </Col>
                          </Panel>
                        </Col>
                      </Row>
                      <SiteInfographic
                        commuterCount={commuters.length}
                        summaryStats={processed.summaryStats}
                        isMultiSite={isMultiSite}
                      />
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
                <Tab eventKey='commuters' title={<span><Icon type='users' /> Commuters</span>}>
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
                                <td>{processed.pctGeocoded}</td>
                              </tr>
                              <tr>
                                <td>% of commutes calculated:</td>
                                <td>{processed.pctStatsCalculated}</td>
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
                                <td>{processed.pctGeocoded}</td>
                                <td>% of commutes calculated:</td>
                                <td>{processed.pctStatsCalculated}</td>
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
                <Tab eventKey='analysis' title={<span><Icon type='bar-chart' /> Analysis</span>}>
                  {/***************************
                    Analysis Tab
                  ***************************/}
                  <Row>
                    <Col xs={6}>
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
                        <option value='CAR'>Carpool</option>
                      </FieldGroup>
                    </Col>
                    {!isMultiSite &&
                      <Col xs={6}>
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
                      </Col>
                    }
                  </Row>
                  <Row>
                    <Col xs={12}>
                      {!isMultiSite &&
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
                      }
                    </Col>
                  </Row>
                  <h4>Commuter Travel Time Summary ({capitalize(analysisMode.toLowerCase())})</h4>
                  <p>
                    This table provides a summary of the distribution of travel times to work.
                    Each row shows how many commuters can commute to work using the currently
                    selected mode up to the travel time listed.
                  </p>
                  <BootstrapTable data={processed.analysisModeStats}>
                    <TableHeaderColumn dataField='bin' isKey width='150'>
                      Travel Time to<br />Work (minutes)
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField='cumulative' width='100'>
                      Number of<br />Commuters
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField='cumulativePct'
                      dataFormat={percentBar}
                      >
                      Percent of Commuters
                    </TableHeaderColumn>
                  </BootstrapTable>
                </Tab>
                <Tab eventKey='ridematches' title={<span><Icon type='car' /> Matches</span>}>
                  {/***************************
                    Ridematches Tab
                  ***************************/}
                  {!processed.allCommutersGeocoded &&
                    <ProgressBar
                      striped
                      now={processed.pctGeocoded}
                      label='Geocoding Commuters'
                      />
                  }
                  {processed.allCommutersGeocoded &&
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
                      <BootstrapTable data={processed.ridematchingAggregateTable}>
                        <TableHeaderColumn dataField='bin' isKey>Ridematch radius (miles)</TableHeaderColumn>
                        <TableHeaderColumn dataField='cumulative'>Number of Commuters</TableHeaderColumn>
                        <TableHeaderColumn
                          dataField='cumulativePct'
                          dataFormat={percentBar}
                          >
                          Percent of Commuters
                        </TableHeaderColumn>
                      </BootstrapTable>

                      <Row>
                        <Col xs={12}>
                          <Panel header={(<h3>Download Match Report</h3>)} className='download-report-panel'>
                            <Col xs={5}>
                              <Button
                                bsStyle='primary'
                                bsSize='large'
                                onClick={() => {
                                  downloadMatches(processed.ridematches)
                                }}
                              >
                                <Icon type='download' /> Download Matches
                              </Button>
                            </Col>
                            <Col xs={7}>
                              <Icon type='info-circle' /> Click "Download Matches" to download a the raw individual ridematch data as a CSV-format spreadsheet.
                            </Col>
                          </Panel>
                        </Col>
                      </Row>
                    </div>
                  }
                </Tab>
                <Tab eventKey='individual-analysis' title={<span><Icon type='user' /> Profiles</span>}>
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
                        {!processed.ridematches[selectedCommuter._id] &&
                          <p>No ridematches within 5 miles of this commuter</p>
                        }
                        {processed.ridematches[selectedCommuter._id] &&
                          <div>
                            <p>{`${processed.ridematches[selectedCommuter._id].matches.length} total matches`}</p>
                            <BootstrapTable
                              data={processed.ridematches[selectedCommuter._id].matches
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
                              pagination={processed.ridematches[selectedCommuter._id].matches.length > 10}
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
            </Col>
          }
          {/***************************
            Map
          ***************************/}
          {this.state.mapDisplayMode !== 'HIDDEN' &&
            <Col xs={5}>
              <div style={
                  this.state.mapDisplayMode === 'FULLSCREEN'
                    ? {
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0
                    }
                    : { height: '600px', marginTop: '1em', marginBottom: '1em' }}>
                <SiteMap ref='map'
                  commuters={commuters}
                  isMultiSite={isMultiSite}
                  polygonStore={polygonStore}
                  selectedCommuter={selectedCommuter}
                  site={site}
                  sites={sites}
                  activeTab={activeTab}
                  analysisMode={analysisMode}
                  analysisMapStyle={analysisMapStyle}
                  commuterRingRadius={commuterRingRadius}
                  isochroneCutoff={isochroneCutoff}
                  rideMatchMapStyle={rideMatchMapStyle}
                  mapDisplayMode={mapDisplayMode}
                  setMapDisplayMode={(mode) => { this._setMapDisplayMode(mode) }}
                />
              </div>
            </Col>
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

function percentBar (n) {
  return <Row>
    <Col xs={9}><ProgressBar now={formatPercent(n)} style={{ marginBottom: 0 }} /></Col>
    <Col xs={3}>{formatPercentAsStr(n)}</Col>
  </Row>
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
