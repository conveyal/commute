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
    commutersById: PropTypes.object.isRequired,
    groupName: PropTypes.string.isRequired,
    organizationId: PropTypes.string.isRequired,
    siteName: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      position: settings.map.focus,
      zoom: 8
    }
  }

  _costRenderer = (cell, row) => {
    return `$${row.mostLikely.cost}`
  }

  _distanceRenderer = (cell, row) => {
    return humanizeDistance(row.mostLikely.distance)
  }

  _durationRenderer = (cell, row) => {
    return humanizeDuration(row.mostLikely.time * 60 * 1000)
  }

  _modeRenderer = (cell, row) => {
    return row.mostLikely.mode
  }

  _nameRenderer = (cell, row) => {
    return this.props.commutersById[row.commuterId].name
  }

  _onRowSelect = (row, isSelected) => {
    // TODO: show on map
    console.log(row)
    console.log('selected: ' + isSelected)
  }

  _ridematchesRenderer = (cell, row) => {
    return row.mostLikely.ridematches
  }

  render () {
    const {id, name} = this.props.analysis
    const {analysis, groupName, organizationId, siteName} = this.props
    const {position, zoom} = this.state
    return (
      <Grid>
        <Row className='individuals-header'>
          <Col xs={12}>
            <h3>
              <span>{name}</span>
              <Button className='pull-right'>
                <Link to={`/analysis/${id}`}>
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
              <TableHeaderColumn dataFormat={this._modeRenderer}>Mode</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._durationRenderer}>Duration</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._distanceRenderer}>Distance</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._costRenderer}>Cost</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._ridematchesRenderer}>Ridematches</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Grid>
    )
  }
}
