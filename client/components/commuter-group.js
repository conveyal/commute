import {Browser, latLngBounds} from 'leaflet'
import React, {Component, PropTypes} from 'react'
import {Button, Col, Grid, Row} from 'react-bootstrap'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {Map as LeafletMap, TileLayer} from 'react-leaflet'
import ClusterLayer from 'react-leaflet-cluster-layer'
import {Link} from 'react-router'

import Icon from './icon'
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
    group: PropTypes.object.isRequired
  }

  componentWillMount () {
    this.props.loadCommuters({ groupId: this.props.group._id })
  }

  _commuterToolsRenderer = (cell, row) => {
    const groupId = this.props.group._id
    const doDelete = () => this.props.deleteCommuter({ id: row._id, groupId })
    const onClick = () => actUponConfirmation(messages.commuter.deleteConfirmation, doDelete)
    return <div>
      <Button bsStyle='warning'>
        <Link to={`/commuter/${row._id}/edit`}>Edit</Link>
      </Button>
      <Button bsStyle='danger' onClick={onClick}>Delete</Button>
    </div>
  }

  handleDelete = () => {
    const {_id: groupId, organizationId} = this.props.group
    const doDelete = () => this.props.deleteGroup(groupId, organizationId)
    actUponConfirmation(messages.organization.deleteConfirmation, doDelete)
  }

  render () {
    const {commuters, group} = this.props
    const {allAddressesGeocoded, groupName, organizationId} = group
    const {bounds, markers, position, zoom} = mapCommuters(allAddressesGeocoded, commuters)
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
          {allAddressesGeocoded &&
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
          }
          {!allAddressesGeocoded &&
            <Col xs={12} className='group-geocode-progress'>
              <p>Geocoding commuter addresses...</p>
            </Col>
          }
        </Row>
        <Row className='group-content'>
          <Col xs={12}>
            <BootstrapTable data={commuters}>
              <TableHeaderColumn dataField='_id' isKey hidden />
              <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
              <TableHeaderColumn dataField='address'>Address</TableHeaderColumn>
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
      <div style={style}>{cluster.markers.length} items</div>
    )
  }
}

const mapCommuters = (allAddressesGeocoded, commuters) => {
  if (commuters.length === 0 || !allAddressesGeocoded) {
    return {
      markers: [],
      position: settings.map.focus,
      zoom: 8
    }
  } else if (commuters.length === 1) {
    return {
      markers: [{
        id: commuters[0]._id,
        name: commuters[0].name,
        position: {
          lat: commuters[0].lat,
          lng: commuters[0].lng
        }
      }],
      position: settings.map.focus,
      zoom: 8
    }
  }
  const markers = []
  const firstLL = [commuters[0].lat, commuters[0].lng]
  const bounds = latLngBounds([firstLL, firstLL])
  commuters.forEach((commuter) => {
    const {_id, lat, lng, name} = commuter
    markers.push({
      _id,
      name,
      position: { lat, lng }
    })
    bounds.extend([lat, lng])
  })
  return {bounds, markers}
}
