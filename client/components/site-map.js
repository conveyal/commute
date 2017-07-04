import React, {Component, PropTypes} from 'react'
import {Browser, icon, latLngBounds, point} from 'leaflet'
import {Circle, GeoJSON, Map as LeafletMap, Marker, Popup, TileLayer} from 'react-leaflet'
import {Button} from 'react-bootstrap'
import Heatmap from 'react-leaflet-heatmap-layer'
import {geom, io, precision, simplify} from 'jsts'
import hslToHex from 'colorvert/hsl/hex'
import humanizeDuration from 'humanize-duration'
import {toLeaflet} from '@conveyal/lonlat'

import Icon from './icon'
import Legend from './legend'
import MarkerCluster from './marker-cluster'
import { humanizeDistance } from '../utils'

const geoJsonReader = new io.GeoJSONReader()
const geoJsonWriter = new io.GeoJSONWriter()

const homeIconUrl = `${process.env.STATIC_HOST}assets/home-2.png`
const homeIcon = icon({
  iconUrl: homeIconUrl,
  iconSize: [32, 37],
  iconAnchor: [16, 37]
})

const homeIconSelectedUrl = `${process.env.STATIC_HOST}assets/home-2-selected.png`
const homeIconSelected = icon({
  iconUrl: homeIconSelectedUrl,
  iconSize: [32, 37],
  iconAnchor: [16, 37]
})
const homeIconSelectedOffset = point(0, -20)

export default class SiteMap extends Component {
  static propTypes = {
    activeTab: PropTypes.string,
    commuters: PropTypes.array,
    isMultiSite: PropTypes.bool,
    mapDisplayMode: PropTypes.string,
    polygonStore: PropTypes.object,
    selectedCommuter: PropTypes.object,
    site: PropTypes.object,
    sites: PropTypes.array,
    setMapDisplayMode: PropTypes.func
  }

  resized () {
    this.refs['leafletMap'].leafletElement.invalidateSize(false)
  }

  _mapSitesAndCommuters = () => {
    const {commuters, isMultiSite, site, sites, selectedCommuter} = this.props
    const commuterMarkers = []
    const siteMarkers = []
    let sitesToMakeMarkersFor

    if (isMultiSite) {
      sitesToMakeMarkersFor = sites
    } else {
      sitesToMakeMarkersFor = [site]
    }

    const firstSiteCoordinates = toLeaflet(sitesToMakeMarkersFor[0].coordinate)
    const bounds = latLngBounds([firstSiteCoordinates, firstSiteCoordinates])

    sitesToMakeMarkersFor.forEach((siteToMakeMarkerFor) => {
      const sitePosition = toLeaflet(siteToMakeMarkerFor.coordinate)

      // add site marker
      siteMarkers.push(
        <Marker
          key={`site-marker-${siteToMakeMarkerFor._id}`}
          position={sitePosition}
          zIndexOffset={9000}
        />
      )

      bounds.extend(sitePosition)
    })

    // add all commuters to site
    commuters.forEach((commuter) => {
      if (commuter.coordinate.lat === 0) return  // don't include commuters not geocoded yet
      const commuterPosition = toLeaflet(commuter.coordinate)
      const isSelectedCommuter = selectedCommuter && selectedCommuter._id === commuter._id
      commuterMarkers.push(
        <Marker
          icon={isSelectedCommuter ? homeIconSelected : homeIcon}
          key={`commuter-marker-${commuter._id}`}
          onClick={() => this._handleSelectCommuter(commuter, true)}
          position={commuterPosition}
          zIndexOffset={1234}
          >
          <Popup
            offset={homeIconSelectedOffset}
            >
            <h4>{commuter.name}</h4>
          </Popup>
        </Marker>
      )
      bounds.extend(commuterPosition)
    })

    // return only site marker if no commuters or commuters haven't loaded yet
    if (commuterMarkers.length === 0 && siteMarkers.length === 1) {
      return {
        siteMarkers,
        position: firstSiteCoordinates,
        zoom: 11
      }
    }

    return {
      bounds,
      commuterMarkers,
      siteMarkers
    }
  }

  render () {
    const { activeTab, commuters, isMultiSite, polygonStore, selectedCommuter, site } = this.props
    const { analysisMode, analysisMapStyle, commuterRingRadius, isochroneCutoff, rideMatchMapStyle, mapDisplayMode, setMapDisplayMode } = this.props

    const hasCommuters = commuters.length > 0

    /************************************************************************
     map stuff
    ************************************************************************/
    const mapLegendProps = {
      html: '<h4>Legend</h4><table><tbody>',
      position: 'bottomright'
    }

    // add marker to legend
    const siteIconUrl = 'https://unpkg.com/leaflet@1.0.2/dist/images/marker-icon-2x.png'
    mapLegendProps.html += `<tr><td><img src="${siteIconUrl}" style="width: 25px;"/></td><td>Site</td></tr>`

    const {bounds, commuterMarkers, position, siteMarkers, zoom} = this._mapSitesAndCommuters()
    const clusterMarkers = []
    const commuterRings = []

    if (hasCommuters) {
      if (activeTab === 'ridematches') {
        if (rideMatchMapStyle === 'normal') {
          mapLegendProps.html += `<tr><td><img src="${homeIconUrl}" /></td><td>Commuter</td></tr>`
        } else if (rideMatchMapStyle === 'marker-clusters') {
          mapLegendProps.html += `<tr>
            <td>
              <img src="${homeIconUrl}" />
            </td>
            <td>Single Commuter</td>
          </tr>
          <tr>
            <td>
              <img src="${process.env.STATIC_HOST}assets/cluster.png" style="width: 40px;"/>
            </td>
            <td>Cluster of Commuters</td>
          </tr>`

          commuterMarkers.forEach((marker) => {
            clusterMarkers.push({
              id: marker.key,
              latLng: marker.props.position,
              markerOptions: marker.props,
              onClick: marker.props.onClick
            })
          })
        } else if (rideMatchMapStyle === 'heatmap') {
          mapLegendProps.html += `<tr>
            <td
              rowspan="2"
              style="background-image: url(${process.env.STATIC_HOST}assets/heatmap-gradient.png);
                background-size: contain;"
              />
            <td>Less Commuters</td>
          </tr>
          <tr>
            <td>More Commuters</td>
          </tr>`
        } else if (rideMatchMapStyle === 'commuter-rings') {
          mapLegendProps.html += `<tr>
            <td>
              <img src="${homeIconUrl}" />
            </td>
            <td>Commuter</td>
          </tr>
          <tr>
            <td>
              <div style="border: 3px solid #3388ff; border-radius: 20px; overflow: hidden;">
                <div style="background-color: #3388ff; opacity: 0.2; height: 25px;">
                  &nbsp;
                </div>
              </div>
            </td>
            <td>${humanizeDistance(commuterRingRadius, 2)} Radius</td>
          </tr>`

          const meters = commuterRingRadius * 1609.34

          commuterMarkers.forEach((marker) => {
            commuterRings.push(
              <Circle
                center={marker.props.position}
                key={`commuter-circle-${marker.key}`}
                radius={meters}
                />
            )
          })
        }
      } else {
        mapLegendProps.html += `<tr><td><img src="${homeIconUrl}" /></td><td>Commuter</td></tr>`
      }
    }

    if ((!(activeTab === 'ridematches') || (
      activeTab === 'ridematches' && rideMatchMapStyle !== 'heatmap'
    )) && selectedCommuter) {
      mapLegendProps.html += `<tr>
        <td>
          <img src="${homeIconSelectedUrl}" />
        </td>
        <td>${selectedCommuter.name}</td>
      </tr>`
    }

    // isochrones
    const isochrones = []
    if (!isMultiSite &&
      activeTab === 'analysis' &&
      site.calculationStatus === 'successfully') {
      // travel times calculated successfully
      const curIsochrones = getIsochrones({
        analysisMapStyle,
        analysisMode,
        isochroneCutoff,
        polygonStore,
        site
      })
      curIsochrones
        .filter((isochrone) => isochrone.properties.time <= isochroneCutoff)
        .forEach((isochrone) => {
          const geojsonProps = {
            data: Object.assign(isochrone, { type: 'Feature' }),
            key: `isochrone-${analysisMapStyle}-${analysisMode}-${isochrone.properties.time}`,
            onEachFeature
          }

          if (isochroneStyleStrategies[analysisMapStyle]) {
            Object.assign(geojsonProps, isochroneStyleStrategies[analysisMapStyle])
          }

          isochrones.push(
            <GeoJSON {...geojsonProps} />
          )
        })

      mapLegendProps.html += getIsochroneLegendHtml({ analysisMapStyle, isochroneCutoff, analysisMode })
    }

    mapLegendProps.html += '</tbody></table>'

    return (
      <LeafletMap ref='leafletMap'
        style={{ width: '100%', height: '100%' }}
        center={position}
        bounds={bounds}
        zoom={zoom}
        >
        <TileLayer
          url={Browser.retina &&
            process.env.LEAFLET_RETINA_URL
            ? process.env.LEAFLET_RETINA_URL
            : process.env.LEAFLET_TILE_URL}
          attribution={process.env.LEAFLET_ATTRIBUTION}
          />
        {siteMarkers}
        {activeTab !== 'ridematches' && commuterMarkers}
        {activeTab === 'ridematches' && rideMatchMapStyle === 'normal' &&
          commuterMarkers}
        {activeTab === 'ridematches' && rideMatchMapStyle === 'marker-clusters' &&
          <MarkerCluster
            newMarkerData={clusterMarkers}
            />
        }
        {activeTab === 'ridematches' && rideMatchMapStyle === 'heatmap' &&
          <Heatmap
            intensityExtractor={m => 1000}
            latitudeExtractor={m => m.props.position.lat}
            longitudeExtractor={m => m.props.position.lng}
            points={commuterMarkers}
            />
        }
        {activeTab === 'ridematches' && rideMatchMapStyle === 'commuter-rings' &&
          commuterRings}
        {activeTab === 'ridematches' && rideMatchMapStyle === 'commuter-rings' &&
          commuterMarkers}
        {isochrones}
        <Legend {...mapLegendProps} />
        {mapDisplayMode === 'STANDARD' &&
          <div style={{ position: 'absolute', right: '10px', top: '10px', zIndex: '10000' }}>
            <Button bsSize='small' onClick={() => { setMapDisplayMode('HIDDEN') }}>
              <Icon type='compress' /> Hide Map
            </Button>
            <Button bsSize='small' onClick={() => { setMapDisplayMode('FULLSCREEN') }}>
              <Icon type='expand' /> Fullscreen
            </Button>
          </div>
        }
        {mapDisplayMode === 'FULLSCREEN' &&
          <div style={{ position: 'absolute', right: '10px', top: '10px', zIndex: '10000' }}>
            <Button bsSize='small' onClick={() => { setMapDisplayMode('STANDARD') }}>
              <Icon type='times' />
            </Button>
          </div>
        }
      </LeafletMap>
    )
  }
}

function capitalize (s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** getIsochroneLegendHtml **/

function getIsochroneLegendHtml ({ analysisMapStyle, isochroneCutoff, analysisMode }) {
  let html = `<tr><td colspan="2">Travel Time (by ${capitalize(analysisMode.toLowerCase())})</td></tr>`
  const strategy = getIsochroneStrategies[analysisMapStyle]

  if (strategy === 'single isochrone') {
    html += `<tr>
      <td>
        <div style="border: 1px solid black;">
          <div style="background-color: ${fillColor[analysisMapStyle]}; opacity: 0.4;">
            &nbsp;
          </div>
        </div>
      </td>
      <td>0 - ${shortEnglishHumanizer(isochroneCutoff * 1000)}</td>
    </tr>`
  } else if (strategy === 'inverted isochrone') {
    html += `<tr>
      <td><div style="border: 3px solid #3388FF;">&nbsp;</div></td>
      <td>0 - ${shortEnglishHumanizer(isochroneCutoff * 1000)}</td>
    </tr>`
  } else {
    const timeGap = 900

    for (let curTime = timeGap; curTime <= 7200; curTime += timeGap) {
      html += `<tr>
        <td style="background-color: ${fillColor[analysisMapStyle](curTime)}; opacity: 0.4;"></td>
        <td>${shortEnglishHumanizer((curTime - timeGap) * 1000)} - ${shortEnglishHumanizer(curTime * 1000)}</td>
      </tr>`
    }
  }
  return html
}

/** getIsochrones **/

const getIsochroneCache = {}

function getIsochrones ({ analysisMapStyle, analysisMode, isochroneCutoff, polygonStore, site }) {
  const strategy = getIsochroneStrategies[analysisMapStyle]
  const cacheQuery = [
    site.coordinate.lat,
    site.coordinate.lng,
    analysisMode,
    strategy === (strategy.indexOf('minute') > -1) ? strategy : `${strategy}-${isochroneCutoff}`
  ].join('-')
  if (getIsochroneCache[cacheQuery]) {
    return getIsochroneCache[cacheQuery]
  }

  const allPolygons = Object.values(polygonStore)

  // single extent isochrone
  if (strategy.indexOf('minute') === -1) {
    // diff isochrones to get 5 minute isochrones
    for (let i = 0; i < allPolygons.length; i++) {
      const curPolygon = allPolygons[i]
      if (curPolygon.mode === analysisMode &&
        curPolygon.siteId === site._id &&
        curPolygon.properties.time === isochroneCutoff) {
        if (strategy === 'single isochrone') {
          getIsochroneCache[cacheQuery] = [curPolygon]
          return [curPolygon]
        } else if (strategy === 'inverted isochrone') {
          // diff against massive polygon
          const hugePolygon = {
            coordinates: [[
              [-179.9999, -89.9999],
              [-179.9999, 89.9999],
              [179.9999, 89.9999],
              [179.9999, -89.9999],
              [-179.9999, -89.9999]
            ]],
            type: 'Polygon'
          }
          const hugePolygonGeometry = geoJsonReader.read(JSON.stringify(hugePolygon))
          const invertedGeom = hugePolygonGeometry.difference(reduceAndSimplifyGeometry(curPolygon.geometry))
          const invertedIsochrone = {
            geometry: geoJsonWriter.write(invertedGeom),
            properties: curPolygon.properties,
            type: 'Feature'
          }
          getIsochroneCache[cacheQuery] = [invertedIsochrone]
          return [invertedIsochrone]
        }
      }
    }
    // no match found
    return []
  }

  const sitePolygons = allPolygons
    .filter((polygon) => polygon.mode === analysisMode && polygon.siteId === site._id)
    .sort((a, b) => a.properties.time - b.properties.time)

  let timeGap = 900
  if (strategy === '5-minute isochrones') {
    timeGap = 300
  }

  // diff isochrones to get desired isochrones
  const isochrones = []
  let traversedIsochrone
  sitePolygons
    .filter((polygon) => polygon.properties.time % timeGap === 0)
    .forEach((polygon) => {
      const curFeatureGeometry = reduceAndSimplifyGeometry(polygon.geometry)
      let isochroneGeometry

      if (!traversedIsochrone) {
        isochroneGeometry = curFeatureGeometry
      } else {
        isochroneGeometry = curFeatureGeometry.difference(traversedIsochrone)
      }

      isochrones.push({
        geometry: geoJsonWriter.write(isochroneGeometry),
        properties: polygon.properties,
        type: 'Feature'
      })
      traversedIsochrone = curFeatureGeometry
    })

  getIsochroneCache[cacheQuery] = isochrones
  return isochrones
}

const getIsochroneStrategies = {
  'blue-incremental': '5-minute isochrones',
  'blue-incremental-15-minute': '15-minute isochrones',
  'blue-solid': 'single isochrone',
  'green-red-diverging': '5-minute isochrones',
  'inverted': 'inverted isochrone'
}

const fillColor = {
  'blue-incremental': (time) => hslToHex(240, 100, time * 0.00942 + 27.1739),
  'blue-incremental-15-minute': (time) => hslToHex(240, 100, Math.floor(time / 900) * 8.125 + 30),
  'blue-solid': '#000099',
  'green-red-diverging': (time) => hslToHex(time * -0.017391304347826 + 125.217391304348, 100, 50),
  'inverted': '#000099'
}

const isochroneStyleStrategies = {
  'blue-incremental': {
    fillOpacity: 0.4,
    stroke: false,
    style: (feature) => {
      return {
        fillColor: fillColor['blue-incremental'](feature.properties.time)
      }
    }
  },
  'blue-incremental-15-minute': {
    color: '#000000',
    fillOpacity: 0.4,
    stroke: true,
    style: (feature) => {
      return {
        fillColor: fillColor['blue-incremental'](feature.properties.time)
      }
    },
    weight: 1
  },
  'blue-solid': {
    color: '#000000',
    fillColor: fillColor['blue-solid'],
    fillOpacity: 0.4,
    stroke: true,
    weight: 1
  },
  'green-red-diverging': {
    fillOpacity: 0.4,
    stroke: false,
    style: (feature) => {
      return {
        fillColor: fillColor['green-red-diverging'](feature.properties.time)
      }
    }
  }
}

function onEachFeature (feature, layer) {
  if (feature.properties) {
    let pop = '<p>'
    Object.keys(feature.properties).forEach((name) => {
      const val = feature.properties[name]
      pop += name.toUpperCase()
      pop += ': '
      pop += name.toUpperCase() === 'TIME' ? humanizeDuration(val * 1000) : val
      pop += '<br />'
    })
    pop += '</p>'
    layer.bindPopup(pop)
  }
}

function reduceAndSimplifyGeometry (inputGeomerty) {
  const geometry = geoJsonReader.read(JSON.stringify(inputGeomerty))
  const precisionModel = new geom.PrecisionModel(10000)
  const precisionReducer = new precision.GeometryPrecisionReducer(precisionModel)
  return precisionReducer.reduce(simplify.DouglasPeuckerSimplifier.simplify(geometry, 0.001))
}

const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: 'shortEn',
  languages: {
    shortEn: {
      y: () => 'y',
      mo: () => 'mo',
      w: () => 'w',
      d: () => 'd',
      h: () => 'h',
      m: () => 'm',
      s: () => 's',
      ms: () => 'ms'
    }
  },
  spacer: ''
})
