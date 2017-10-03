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

  /**
   * Update the data in the marker cluster.
   * Called in both componentWillMount and componentWillReceiveProps.
   */
  _addDataToCluster (nextProps) {
    const {markers: oldMarkers} = this.props
    const map = this.context.map

    // add markers to cluster layer
    if (nextProps.newMarkerData && nextProps.newMarkerData.length > 0) {
      const markers = Object.assign({}, oldMarkers)
      const newMarkers = []

      nextProps.newMarkerData.forEach((obj) => {
        const leafletMarker = Leaflet.marker(obj.latLng, obj.markerOptions)
          .on('click', () => {
            map.panTo(obj.latLng)
            if (obj.onClick) {
              obj.onClick(obj)
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
      const marker = oldMarkers[nextProps.focusMarker.id]

      this.leafletElement.zoomToShowLayer(marker, () => {
        map.panTo(nextProps.focusMarker.latLng)
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
