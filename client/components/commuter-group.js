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
    deleteCommuter: PropTypes.func,
    deleteGroup: PropTypes.func,
    update: PropTypes.func,

    // props]
    organizationId: PropTypes.string.isRequired,
    group: PropTypes.object.isRequired
  }

  _commuterToolsRenderer = (cell, row) => {
    const groupId = this.props.group.id
    const organzationId = this.props.organizationId
    const doDelete = () => this.props.deleteCommuter({ commuterId: row.id, groupId, organzationId })
    const onClick = () => actUponConfirmation(messages.commuter.deleteConfirmation, doDelete)
    return <div>
      <Button bsStyle='warning'>
        <Link to={`/organizations/${organzationId}/groups/${groupId}/commuters/${row.id}/edit`}>Edit</Link>
      </Button>
      <Button bsStyle='danger' onClick={onClick}>Delete</Button>
    </div>
  }

  handleDelete = () => {
    const doDelete = () => this.props.deleteGroup(this.state.group.id, this.props.organizationId)
    actUponConfirmation(messages.organization.deleteConfirmation, doDelete)
  }

  render () {
    const {group, organizationId} = this.props
    const {commuters, groupName} = group
    const {bounds, markers, position, zoom} = mapCommuters(commuters)
    return (
      <Grid>
        <Row>
          <Col xs={12} lg={7} style={{height: '400px'}}>
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
        </Row>
        <Row className='group-content'>
          <Col xs={12}>
            <h3>
              <span>{groupName}</span>
              <Button className='pull-right'>
                <Link to={`/organizations/${organizationId}`}><Icon type='arrow-left' />Back</Link>
              </Button>
            </h3>
            <BootstrapTable data={commuters}>
              <TableHeaderColumn dataField='id' isKey hidden />
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

const mapCommuters = (commuters) => {
  if (commuters.length === 0) {
    return {
      markers: [],
      position: settings.map.focus,
      zoom: 8
    }
  }
  const markers = []
  const firstLL = [commuters[0].lat, commuters[0].lng]
  const bounds = latLngBounds([firstLL, firstLL])
  commuters.forEach((commuter) => {
    const {id, lat, lng, name} = commuter
    markers.push({
      id,
      name,
      position: { lat, lng }
    })
    bounds.extend([lat, lng])
  })
  return {bounds, markers}
}
