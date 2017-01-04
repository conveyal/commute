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
    newMarkerData: [],
    focusMarker: {}
  }

  componentWillMount () {
    super.componentWillMount()

    this.state = { markers: {} }
    this.leafletElement = Leaflet.markerClusterGroup()
  }

  componentWillReceiveProps (nextProps) {
    super.componentWillReceiveProps(nextProps)

    const markers = this.state.markers

    // add markers to cluster layer
    if (nextProps.newMarkerData.length > 0) {
      const markersToAdd = []

      nextProps.newMarkerData.forEach((obj) => {
        let marker
        let shouldBindPopup = true

        if (markers[obj.id]) {
          // update popup if needed
          marker = this.state.markers[obj.id]
          if (marker.caption !== obj.caption) {
            marker.unbindPopup()
          } else {
            shouldBindPopup = false
          }
        } else {
          marker = Leaflet.marker(obj.latLng)
          markers[obj.id] = marker
          markersToAdd.push(marker)
        }

        if (shouldBindPopup) {
          const markerPopupHtml = `<div>
              <p>${obj.caption}</p>
            </div>`

          marker.bindPopup(markerPopupHtml, {maxHeight: 350, maxWidth: 250, minWidth: 250})
            .on('click', () => this.props.map.panTo(obj.latLng))
        }
      })

      this.leafletElement.addLayers(markersToAdd)

      this.setState({ markers })
    }

    // zoom to particular marker
    if (Object.keys(nextProps.focusMarker).length > 0) {
      const marker = markers[nextProps.focusMarker.id]

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
