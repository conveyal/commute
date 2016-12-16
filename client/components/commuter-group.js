import {Browser, latLngBounds} from 'leaflet'
import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'
import ClusterLayer from 'react-leaflet-cluster-layer'
import {Link} from 'react-router'

import Icon from './icon'
import ProgressManager from './progress-manager'
import {messages, settings} from '../utils/env'
import {actUponConfirmation} from '../utils/ui'

export default class CommuterGroup extends Component {
  static propTypes = {
    // dispatch
    deleteCommuter: PropTypes.func.isRequired,
    deleteGroup: PropTypes.func.isRequired,
    loadCommuters: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,

    // props
    commuters: PropTypes.array.isRequired,
    group: PropTypes.object.isRequired,
    numCommutersGeocoded: PropTypes.number.isRequired
  }

  componentWillMount () {
    this._loadCommuters()
  }

  _commuterToolsRenderer = (cell, row) => {
    return <div>
      <Button bsStyle='warning'>
        <Link to={`/commuter/${row._id}/edit`}>Edit</Link>
      </Button>
      <Button bsStyle='danger' onClick={this._onDeleteCommuterClick.bind(this, row)}>Delete</Button>
    </div>
  }

  _handleDelete = () => {
    const {_id: groupId, organizationId} = this.props.group
    const doDelete = () => this.props.deleteGroup(groupId, organizationId)
    actUponConfirmation(messages.organization.deleteConfirmation, doDelete)
  }

  _loadCommuters () {
    this.props.loadCommuters({ groupId: this.props.group._id })
  }

  _onDeleteCommuterClick (commuter) {
    const doDelete = () => this.props.deleteCommuter(commuter)
    actUponConfirmation(messages.commuter.deleteConfirmation, doDelete)
  }

  render () {
    const {commuters, group, numCommutersGeocoded} = this.props
    const allAddressesGeocoded = commuters.length === numCommutersGeocoded
    const {groupName, organizationId} = group
    const {bounds, markers, position, zoom} = mapCommuters(commuters)
    return (
      <Grid>
        <Row>
          <Col xs={12} className='group-header'>
            <h3>
              <span>{groupName}</span>
              <Button className='pull-right'>
                <Link to={`/organization/${organizationId}`}>
                  <Icon type='arrow-left' />
                  <span>Back</span>
                </Link>
              </Button>
            </h3>
          </Col>
          <Col xs={12} style={{height: '400px'}}>
            <LeafletMap center={position} bounds={bounds} zoom={zoom}>
              <TileLayer
                url={Browser.retina &&
                  process.env.LEAFLET_RETINA_URL
                  ? process.env.LEAFLET_RETINA_URL
                  : process.env.LEAFLET_TILE_URL}
                attribution={process.env.LEAFLET_ATTRIBUTION}
                />
              <ClusterLayer
                markers={markers}
                clusterComponent={ClusterComponent}
                />
            </LeafletMap>
          </Col>
          {!allAddressesGeocoded &&
            <Col xs={12} className='group-geocode-progress'>
              <h4>Geocoding commuter addresses...</h4>
              <ProgressManager
                numDone={numCommutersGeocoded}
                numTotal={commuters.length}
                refreshFn={() => this._loadCommuters()}
                intervalLengthMs={1200}
                />
            </Col>
          }
        </Row>
        <Row className='group-content'>
          <Col xs={12}>
            <BootstrapTable data={commuters}>
              <TableHeaderColumn dataField='_id' isKey hidden />
              <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='original_address'>Original Address</TableHeaderColumn>
              <TableHeaderColumn dataField='address'>Geocoded Address</TableHeaderColumn>
              <TableHeaderColumn dataFormat={geocodeConfidenceRenderer}>Geocode Confidence</TableHeaderColumn>
              <TableHeaderColumn dataField='email'>Email</TableHeaderColumn>
              <TableHeaderColumn dataFormat={this._commuterToolsRenderer}>Tools</TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </Grid>
    )
  }
}

class ClusterComponent extends React.Component {
  render () {
    const style = {
      border: 'solid 2px darkgrey',
      borderRadius: '8px',
      backgroundColor: 'white',
      padding: '1em',
      textAlign: 'center'
    }
    const cluster = this.props.cluster

    if (cluster.markers.length === 1) {
      return (
        <div style={style} >{cluster.markers[0].name}</div>
      )
    }

    return (
      <div style={style}>{cluster.markers.length}</div>
    )
  }
}

function mapCommuters (commuters) {
  if (commuters.length === 0) {
    return {
      markers: [],
      position: settings.geocoder.focus,
      zoom: 8
    }
  } else if (commuters.length === 1) {
    return {
      markers: [{
        id: commuters[0]._id,
        name: commuters[0].name,
        position: commuters[0].coordinate
      }],
      position: settings.geocoder.focus,
      zoom: 8
    }
  }
  const markers = []
  const firstLL = [commuters[0].coordinate.lat, commuters[0].coordinate.lon]
  const bounds = latLngBounds([firstLL, firstLL])
  commuters.forEach((commuter) => {
    const {_id, coordinate, name} = commuter
    if (commuter.coordinate.lat && commuter.coordinate.lon) {
      markers.push({
        _id,
        name,
        position: coordinate
      })
      bounds.extend([coordinate.lat, coordinate.lon])
    }
  })
  return {bounds, markers}
}

function geocodeConfidenceRenderer (cell, row) {
  const {geocodeConfidence} = row
  if (geocodeConfidence === -1) {
    return 'calculating...'
  } else {
    return `${Math.round(geocodeConfidence * 100)} %`
  }
}
