import fetch from 'isomorphic-fetch'
import humanizeDuration from 'humanize-duration'
import {Browser} from 'leaflet'
import otpProfileToTransitive from 'otp-profile-to-transitive'
import qs from 'qs'
import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'
import {Link} from 'react-router'

import Icon from '../icon'
import TransitiveLayer from '../transitive-layer'
import analysisDefaults from '../../utils/analysisDefaults'
import {formatCurrency, humanizeDistance} from '../../utils/components'
import {settings} from '../../utils/env'

const {metrics} = analysisDefaults

export default class Individuals extends Component {
  static propTypes = {
    // dispatch
    deleteAnalysis: PropTypes.func,
    loadCommuters: PropTypes.func.isRequired,

    // props
    analysis: PropTypes.object.isRequired,
    commuterStore: PropTypes.object.isRequired,
    groupName: PropTypes.string.isRequired,
    site: PropTypes.object.isRequired
  }

  state = {
    position: settings.geocoder.focus,
    transitiveData: {},
    zoom: 8
  }

  componentWillMount () {
    // load commuter store
    this.props.loadCommuters({ groupId: this.props.analysis.groupId })
  }

  _nameRenderer = (cell, row) => {
    const commuter = this.props.commuterStore[row.commuterId]
    return commuter ? commuter.name : 'loading'
  }

  _onRowSelect = (row, isSelected) => {
    // assemble data for otp profile query
    const commuter = this.props.commuterStore[row.commuterId]
    if (!commuter) {
      return this.setState({ transitiveData: {} })
    }

    const {site} = this.props
    console.log(commuter, site)

    const otpQuery = {
      accessModes: 'WALK,BICYCLE,BICYCLE_RENT,CAR_PARK',
      bikeSafe: 1000,
      bikeSpeed: 3.57632,
      date: '2016-12-15',
      directModes: 'WALK,BICYCLE,BICYCLE_RENT,CAR',
      egressModes: 'WALK,BICYCLE_RENT',
      endTime: '9:00',
      from: coordinatesToArray(commuter.coordinate),
      maxBikeTime: 20,
      maxWalkTime: 15,
      maxCarTime: 45,
      startTime: '7:00',
      to: coordinatesToArray(site.coordinate),
      limit: 2,
      transitModes: 'BUS,TRAINISH',
      walkSpeed: 1.34112
    }

    // console.log(`${process.env.OTP_URL}/plan?${qs.stringify(otpQuery)}`)

    fetch(`/api/otp-proxy?${qs.stringify(otpQuery)}`)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        console.log(json)
        const from = {
          lat: commuter.coordinate.lat,
          lon: commuter.coordinate.lng,
          name: commuter.name
        }
        const to = {
          lat: site.coordinate.lat,
          lon: site.coordinate.lng,
          name: site.name
        }
        this.setState({
          transitiveData: otpProfileToTransitive({
            from,
            to,
            patterns: json.patterns,
            profile: {
              options: json.profile
            },
            routes: json.routes
          })
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  render () {
    const {_id: analysisId, name} = this.props.analysis
    const {analysis, groupName, site} = this.props
    const {position, transitiveData, zoom} = this.state
    return (
      <Grid>
        <Row className='individuals-header'>
          <Col xs={12}>
            <h3>
              <span>{name}</span>
              <Button className='pull-right'>
                <Link to={`/analysis/${analysisId}`}>
                  <Icon type='arrow-left' />
                  <span>Back</span>
                </Link>
              </Button>
            </h3>
            <h3>Individual Commutes</h3>
          </Col>
          <Col xs={12} md={6}>
            <h4>
              <strong>Site:</strong>
              <span>{site.name}</span>
            </h4>
          </Col>
          <Col xs={12} md={6}>
            <h4>
              <strong>Group:</strong>
              <span>{groupName}</span>
            </h4>
          </Col>
        </Row>
        <Row>
          <Col xs={8} style={{height: '400px'}}>
            <LeafletMap center={position} zoom={zoom}>
              <TileLayer
                url={Browser.retina &&
                  process.env.LEAFLET_RETINA_URL
                  ? process.env.LEAFLET_RETINA_URL
                  : process.env.LEAFLET_TILE_URL}
                attribution={process.env.LEAFLET_ATTRIBUTION}
                />
              <TransitiveLayer
                transitiveData={transitiveData}
                />
            </LeafletMap>
          </Col>
        </Row>
        <Row className='individuals-content'>
          <Col xs={12}>
            <h3>Individual Trips</h3>
            <BootstrapTable
              data={analysis.trips}
              selectRow={{
                mode: 'radio',
                clickToSelect: true,
                bgColor: 'rgb(238, 193, 213)',
                onSelect: this._onRowSelect
              }}
              >
              <TableHeaderColumn dataField='commuterId' isKey hidden />
              <TableHeaderColumn dataFormat={this._nameRenderer}>Name</TableHeaderColumn>
              <TableHeaderColumn dataFormat={modeRenderer}>Mode</TableHeaderColumn>
              <TableHeaderColumn dataFormat={durationRenderer}>Duration</TableHeaderColumn>
              <TableHeaderColumn dataFormat={distanceRenderer}>Distance</TableHeaderColumn>
              <TableHeaderColumn dataFormat={costRenderer}>Cost</TableHeaderColumn>
              <TableHeaderColumn dataFormat={ridematchesRenderer}>Ridematches</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Grid>
    )
  }
}

function costRenderer (cell, row) {
  return formatCurrency(row.mostLikely.monetaryCost)
}

function distanceRenderer (cell, row) {
  return humanizeDistance(row.mostLikely.distance / metrics.distance.multiplier)
}

function durationRenderer (cell, row) {
  return humanizeDuration(row.mostLikely.time * 1000, { round: true })
}

function modeRenderer (cell, row) {
  return row.mostLikely.mode
}

function ridematchesRenderer (cell, row) {
  return row.mostLikely.ridematches
}

function coordinatesToArray (coords) {
  return `${coords.lat},${coords.lng}`
}
