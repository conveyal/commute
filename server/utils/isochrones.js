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
    uri: `${env.R5_URL}/calculateIsochrones`,
    qs: site.coordinate
  }

  // make request
  request(requestCfg, async (err, res, json) => {
    // handle response
    if (err || !json) {
      console.error('error calculating isochrones: ', err)
      return
    } else if (json.error) {
      console.error('error calculating isochrones: ', json.error)
      return
    }

    // save isochrones to model
    site.travelTimeIsochrones = json.data
    site.save()

    // update site's commuters
    const commuters = await models.Commuter.find({ siteId: site._id, trashed: undefined }).exec()

    commuters.forEach((commuter) => {
      isochroneUtils.calculateIsochroneStatsForCommuter(commuter, json.data)
      commuter.save()
    })
  })
}

isochroneUtils.calculateIsochroneStatsForCommuter = async function (commuter, siteIsochrones) {
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
