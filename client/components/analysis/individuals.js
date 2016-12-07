import humanizeDuration from 'humanize-duration'
import {Browser} from 'leaflet'
import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'
import {Link} from 'react-router'

import Icon from '../icon'
import {humanizeDistance} from '../../utils/components'
import {settings} from '../../utils/env'

export default class Individuals extends Component {
  static propTypes = {
    // dispatch
    deleteAnalysis: PropTypes.func,

    // props
    analysis: PropTypes.object.isRequired,
    commuterStore: PropTypes.object.isRequired,
    groupName: PropTypes.string.isRequired,
    siteName: PropTypes.string.isRequired
  }

  state = {
    position: settings.geocoder.focus,
    zoom: 8
  }

  _nameRenderer = (cell, row) => {
    return this.props.commuterStore[row.commuterId].name
  }

  _onRowSelect = (row, isSelected) => {
    // TODO: show on map
    console.log(row)
    console.log('selected: ' + isSelected)
  }

  render () {
    const {_id: analysisId, name} = this.props.analysis
    const {analysis, groupName, siteName} = this.props
    const {position, zoom} = this.state
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
              <span>{siteName}</span>
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
  return `$${row.mostLikely.cost}`
}

function distanceRenderer (cell, row) {
  return humanizeDistance(row.mostLikely.distance)
}

function durationRenderer (cell, row) {
  return humanizeDuration(row.mostLikely.time * 60 * 1000)
}

function modeRenderer (cell, row) {
  return row.mostLikely.mode
}

function ridematchesRenderer (cell, row) {
  return row.mostLikely.ridematches
}
