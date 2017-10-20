import {control, DomUtil} from 'leaflet'
import {PropTypes} from 'react'
import MapControl from 'react-leaflet/lib/MapControl'

export default class Legend extends MapControl {
  static propTypes = {
    html: PropTypes.string,
    position: PropTypes.string
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.html !== this.props.html) {
      this.div.innerHTML = nextProps.html
    }
  }

  createLeafletElement (props) {
    const legend = control({ position: props.position })
    this.div = DomUtil.create('div', 'legend')
    legend.onAdd = (map) => {
      this.div.innerHTML = props.html
      return this.div
    }
    return legend
  }
}
