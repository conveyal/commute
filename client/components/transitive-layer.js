// copied and modified from https://github.com/troutowicz/geoshare/blob/master/app/components/MarkerCluster.jsx

import {PropTypes} from 'react'
import LeafletTransitiveLayer from 'leaflet-transitivelayer'
import {MapLayer} from 'react-leaflet'
import mapType from 'react-leaflet/lib/Map'
import Transitive from 'transitive-js'

export default class TransitiveLayer extends MapLayer {
  static propTypes = {
    transitiveData: PropTypes.object.isRequired
  }

  static contextTypes = {
    map: mapType
  }

  static defaultProps = {
    transitiveData: {}
  }

  componentWillMount () {
    super.componentWillMount()

    this.transitive = new Transitive({
      displayMargins: {
        bottom: 43,
        right: 330,
        top: 43
      },
      draggableTypes: { PLACE: [ 'from', 'to' ] },
      gridCellSize: 200,
      useDynamicRendering: true,
      styles
    })
    this.leafletElement = new LeafletTransitiveLayer(this.transitive)
  }

  componentWillReceiveProps (nextProps) {
    super.componentWillReceiveProps(nextProps)

    this.transitive.updateData(nextProps.transitiveData)
    this.context.map.fitBounds(this.leafletElement.getBounds())
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return null
  }
}

const styles = {}

function isBikeshareStation (place) {
  return place.place_id.lastIndexOf('bicycle_rent_station') !== -1
}

styles.places = {
  display: function (d, data) {
    var place = data.owner
    if (isBikeshareStation(place) && !place.focused) {
      return 'none'
    }
  },

  fill: function (display, data) {
    var place = data.owner
    if (isBikeshareStation(place)) {
      return '#ef3026'
    } else {
      return 'none'
    }
  },

  stroke: function (display, data) {
    var place = data.owner
    if (isBikeshareStation(place)) {
      return '#ffcb00'
    }
  },

  'stroke-width': function (display, data) {
    var place = data.owner
    if (isBikeshareStation(place)) {
      return '2px'
    }
  },

  r: function (display, data) {
    var place = data.owner
    if (isBikeshareStation(place)) {
      return '10px'
    }
  }

}

styles.segment_labels = {
  'font-weight': 'bold'
}

styles.segments = {
  // override the default stroke color
  stroke: function (display, segment) {
    if (!segment.focused) return
    switch (segment.type) {
      case 'CAR':
      case 'CAR_PARK':
        return '#888'
      case 'WALK':
        return '#0BC8F4'
      case 'BICYCLE':
      case 'BICYCLE_RENT':
        return '#ef3026'
      case 'TRANSIT':
        var route = segment.patterns[0].route
        if (route.route_id) {
          var id = route.route_id.split(':')
          var agency = id[0].toLowerCase()
          var line = id[1].toLowerCase()
          const color = routeToColor(segment.type, agency, line, route.route_color)
          return color
        }
    }
  },

  // override the default stroke width
  'stroke-width': function (display, segment, index, utils) {
    switch (segment.type) {
      case 'CAR':
      case 'CAR_PARK':
      case 'BICYCLE':
      case 'BICYCLE_RENT':
        return '3px'
      case 'WALK':
        return '5px'
      case 'TRANSIT':
        // bus segments:
        if (segment.mode === 3) return utils.pixels(display.zoom.scale(), 2, 4, 6) + 'px'
        // all others:
        return utils.pixels(display.zoom.scale(), 5, 7, 9) + 'px'
    }
  },

  // specify the dash-array
  'stroke-dasharray': function (display, segment) {
    switch (segment.type) {
      case 'BICYCLE':
      case 'BICYCLE_RENT':
      case 'CAR':
      case 'CAR_PARK':
        return '9,7'
      case 'WALK':
        return '0.1,9'
    }
  },

  // specify the line cap type
  'stroke-linecap': function (display, segment) {
    switch (segment.type) {
      case 'CAR':
      case 'CAR_PARK':
        return 'butt'
      case 'WALK':
        return 'round'
      case 'BICYCLE':
        return 'butt'
    }
  },
  envelope: function (display, segment, index, utils) {
    switch (segment.type) {
      case 'TRANSIT':
        if (segment.mode === 3) return utils.pixels(display.zoom.scale(), 2, 4, 6) + 'px'
        // all others:
        return utils.pixels(display.zoom.scale(), 5, 7, 9) + 'px'
    }
  }
}

/** style overrides for segment-based labels **/

styles.segment_label_containers = {
  // specify the fill color for the label bubble
  fill: function (display, label) {
    if (!label.isFocused()) return
    return '#008'
  }
}

styles.segments_halo = {
  'stroke-width': function (display, data, index, utils) {
    return data.computeLineWidth(display) + 6
  }
}

// start/end icons and eventually points of interest//

function getIconSize (data) {
  // bikeshare icon width/height:
  if (isBikeshareStation(data.owner)) return 15

  // all other icons:
  return 30
}

styles.places_icon = {
  // center the icon by offsetting by half the width/height
  x: function (display, data) {
    return -getIconSize(data) / 2
  },
  y: function (display, data) {
    return -getIconSize(data) / 2
  },

  width: function (display, data) {
    return getIconSize(data)
  },
  height: function (display, data) {
    return getIconSize(data)
  },

  'xlink:href': function (display, data) {
    if (isBikeshareStation(data.owner)) {
      if (data.owner.focused) return 'https://d1mkk64om8bike.cloudfront.net/images/graphics/cabi.svg'
      else return false
    }

    if (data.owner.getId() === 'from') return 'https://d1mkk64om8bike.cloudfront.net/images/graphics/start.svg'
    if (data.owner.getId() === 'to') return 'https://d1mkk64om8bike.cloudfront.net/images/graphics/end.svg'
  },
  cursor: 'pointer',
  stroke: 0,
  visibility: function (d, data) {
    if (data.owner.focused) {
      return 'visible'
    } else {
      return 'hidden'
    }
  }
}

styles.multipoints_merged = styles.stops_merged = {
  r: function (display, data, index, utils) {
    return utils.pixels(display.zoom.scale(), 4, 6, 8)
  }
}

function routeToColor (type, agency, line, color) {
  if (color) {
    return `#${color}`
  }

  if (agency === 'dc') {
    if (type === 1 || type === 'TRANSIT') return colors[line]
    return colors.metrobus
  }

  if (colors[agency]) {
    return colors[agency]
  }

  return '#333'
}

/**
 * Predefined Transit Colors
 */

const colors = {
  '1': '#55b848', // ART TODO: Dont have hacky agency
  'agency#1': '#55b848', // ART
  'agency#3': '#2c9f4b', // Maryland Commute Bus
  art: '#55b848',
  blue: '#0076bf',
  cabi: '#d02228',
  'fairfax connector': '#ffff43',
  green: '#00a84f',
  mcro: '#355997',
  metrobus: '#173964',
  orange: '#f7931d',
  prtc: '#5398a0',
  red: '#e21836',
  silver: '#a0a2a0',
  yellow: '#ffd200'
}
