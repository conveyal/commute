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

    this.leafletElement = Leaflet.markerClusterGroup()
  }

  componentWillReceiveProps (nextProps) {
    super.componentWillReceiveProps(nextProps)

    // add markers to cluster layer
    if (nextProps.newMarkerData.length > 0) {
      let markers = Object.assign({}, this.props.markers)
      let newMarkers = []

      nextProps.newMarkerData.forEach((obj) => {
        let markerPopupHtml = `<div>
            <p>${obj.caption}</p>
          </div>`

        let leafletMarker = Leaflet.marker(obj.latLng)
          .bindPopup(markerPopupHtml, {maxHeight: 350, maxWidth: 250, minWidth: 250})
          .on('click', () => this.props.map.panTo(obj.latLng))

        markers[obj.id] = leafletMarker
        newMarkers.push(leafletMarker)
      })

      this.leafletElement.addLayers(newMarkers)
    }

    // zoom to particular marker
    if (Object.keys(nextProps.focusMarker).length > 0) {
      let marker = this.props.markers[nextProps.focusMarker.id]

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
