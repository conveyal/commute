const request = require('request')
const point = require('@turf/helpers').point
const inside = require('@turf/inside')

const models = require('../models')
const env = require('../utils/env').env

const isochroneUtils = {}

isochroneUtils.calculateSiteIsochrones = function (site) {
  // prepare request for server
  const requestCfg = {
    json: true,
    qs: {
      fromLat: site.coordinate.lat,
      fromLon: site.coordinate.lon
    },
    uri: `${env.R5_URL}/calculateIsochrones`
  }

  console.log('initiating calculateIsochrones request with params:')
  console.log(requestCfg)

  // make request
  request(requestCfg, (err, res, json) => {
    // handle response
    if (err || !json) {
      console.error('error calculating isochrones: ', err)
      return
    } else if (json.error) {
      console.error('error calculating isochrones: ', json.error)
      return
    }

    console.log('successfully calculated isochrones')

    // save isochrones to model
    site.travelTimeIsochrones = json.data
    site.save()

    // update site's commuters
    models.Commuter.find({ siteId: site._id, trashed: undefined })
      .exec()
      .then((commuters) => {
        commuters.forEach((commuter) => {
          isochroneUtils.calculateIsochroneStatsForCommuter(commuter, json.data)
          commuter.save()
        })
      })
      .catch((err) => {
        console.error('error finding commuters: ', err)
      })
  })
}

isochroneUtils.calculateIsochroneStatsForCommuter = function (commuter, siteIsochrones) {
  const commuterPoint = point([commuter.coordinate.lon, commuter.coordinate.lat])

  if (!commuter.modeStats) {
    commuter.modeStats = {}
  }

  // calculate which isochrone polygon commuter is in for each mode
  Object.keys(siteIsochrones).forEach((mode) => {
    if (!commuter.modeStats[mode]) {
      commuter.modeStats[mode] = {}
    }

    const modeIsochrones = siteIsochrones[mode]
    // make sure isochrones are sorted by travel times
    modeIsochrones.features.sort((a, b) => a.properties.time - b.properties.time)

    for (let i = 0; i < modeIsochrones.features.length; i++) {
      const curFeature = modeIsochrones.features[i]
      if (inside(commuterPoint, curFeature)) {
        commuter.modeStats[mode].travelTime = curFeature.properties.time
        return
      }
    }
    // destination unreachable in time allotted
    commuter.modeStats[mode].travelTime = -1
  })
}

module.exports = isochroneUtils
