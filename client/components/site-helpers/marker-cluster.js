// copied and modified from https://github.com/troutowicz/geoshare/blob/master/app/components/MarkerCluster.jsx

import {PropTypes} from 'react'
import Leaflet from 'leaflet'
import {MapLayer} from 'react-leaflet'

require('leaflet.markercluster')

export default class MarkerCluster extends MapLayer {
  static propTypes = {
    focusMarker: PropTypes.object,
    map: PropTypes.object,
    markers: PropTypes.object,
    newMarkerData: PropTypes.array.isRequired
  }

  static defaultProps = {
    markers: {},
    newMarkerData: [],
    focusMarker: {}
  }

  componentWillMount () {
    super.componentWillMount()
    this._addDataToCluster(this.props)
  }

  componentWillReceiveProps (nextProps) {
    // Remove layer from map with previously rendered clustered markers
    this.leafletElement.clearLayers()
    this._addDataToCluster(nextProps)
  }

  createLeafletElement () {
    return Leaflet.markerClusterGroup()
  }

  _addDataToCluster (nextProps) {
    // add markers to cluster layer
    if (nextProps.newMarkerData && nextProps.newMarkerData.length > 0) {
      const markers = Object.assign({}, this.props.markers)
      const newMarkers = []

      nextProps.newMarkerData.forEach((obj) => {
        const leafletMarker = Leaflet.marker(obj.latLng, obj.markerOptions)
          .on('click', () => {
            this.props.map.panTo(obj.latLng)
            if (obj.onClick) {
              obj.onClick()
            }
          })

        if (obj.popupHtml) {
          leafletMarker.bindPopup(obj.popupHtml, {maxHeight: 350, maxWidth: 250, minWidth: 250})
        }

        markers[obj.id] = leafletMarker
        newMarkers.push(leafletMarker)
      })

      this.leafletElement.addLayers(newMarkers)
    }

    // zoom to particular marker
    if (Object.keys(nextProps.focusMarker).length > 0) {
      const marker = this.props.markers[nextProps.focusMarker.id]

      this.leafletElement.zoomToShowLayer(marker, () => {
        this.props.map.panTo(nextProps.focusMarker.latLng)
        marker.openPopup()
      })
    }
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return null
  }
}
