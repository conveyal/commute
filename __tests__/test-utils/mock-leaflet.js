/* globals jest */

import Leaflet from 'leaflet'
import assign from 'lodash.assign'
import uniqueId from 'lodash.uniqueid'

// add a div to jsdom for enzyme to mount to
const div = document.createElement('div')
div.id = 'test'
document.body.appendChild(div)

// mock tile layer urls
process.env.LEAFLET_TILE_URL = 'mock.url/tile'

// implementation for creating leaflet objects
function makeUniqueLeafletIdFn (prefix) {
  return () => {
    return {
      _leaflet_id: uniqueId(prefix),
      bindPopup: jest.fn(),
      getLayers: () => [{ on: jest.fn() }],
      setLatLng: jest.fn() // for marker update
    }
  }
}

// copied from https://github.com/PaulLeCam/react-leaflet/blob/master/__mocks__/leaflet.js
class MapMock extends Leaflet.Map {
  constructor (id, options = {}) {
    super(id, options)  // modified this part, so Map mounts in DOM
    assign(this, Leaflet.Mixin.Events)

    this.options = {...Leaflet.Map.prototype.options, ...options}
    this._container = id

    if (options.bounds) {
      this.fitBounds(options.bounds, options.boundsOptions)
    }

    if (options.maxBounds) {
      this.setMaxBounds(options.maxBounds)
    }

    if (options.center && options.zoom !== undefined) {
      this.setView(Leaflet.latLng(options.center), options.zoom)
    }
  }

  _clearPanes () {
    // hijack so react-leaflet map can render in jsdom
  }

  _clearControlPos () {
    // hijack so react-leaflet map can render in jsdom
  }

  _limitZoom (zoom) {
    const min = this.getMinZoom()
    const max = this.getMaxZoom()
    return Math.max(min, Math.min(max, zoom))
  }

  _resetView (center, zoom) {
    this._initialCenter = center
    this._zoom = zoom
  }

  fitBounds (bounds, options) {
    this._bounds = bounds
    this._boundsOptions = options
  }

  getBounds () {
    return this._bounds || Leaflet.latLngBounds([[1, 2], [3, 4]])
  }

  getCenter () {
    return this._initialCenter
  }

  getMaxZoom () {
    return this.options.maxZoom === undefined ? Infinity : this.options.maxZoom
  }

  getMinZoom () {
    return this.options.minZoom === undefined ? 0 : this.options.minZoom
  }

  getZoom () {
    return this._zoom
  }

  latLngToLayerPoint () {
    return { x: 100, y: 100 }
  }

  layerPointToLatLng () {
    return { lat: 38.92, lng: -76.97 }
  }

  remove () { }

  setMaxBounds (bounds) {
    bounds = Leaflet.latLngBounds(bounds)
    this.options.maxBounds = bounds
    return this
  }

  setView (center, zoom) {
    zoom = zoom === undefined ? this.getZoom() : zoom
    this._resetView(Leaflet.latLng(center), this._limitZoom(zoom))
    return this
  }

  setZoom (zoom) {
    return this.setView(this.getCenter(), zoom)
  }
}

// mock these things w/ jest so that it can be verified that
// elements are to be created by react-leaflet
Leaflet.circleMarker = jest.fn(makeUniqueLeafletIdFn('circleMarker'))
Leaflet.geoJson = jest.fn(makeUniqueLeafletIdFn('geoJson'))
Leaflet.marker = jest.fn(makeUniqueLeafletIdFn('marker'))
Leaflet.rectangle = jest.fn(makeUniqueLeafletIdFn('rectangle'))
Leaflet.Map = MapMock
Leaflet.map = (id, options) => new MapMock(id, options)

export default Leaflet

export function drawMock () {
  Leaflet.Draw = {
    Polygon: jest.fn(() => { return { enable: jest.fn(), disable: jest.fn() } })
  }
}
