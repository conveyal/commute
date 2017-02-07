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

  const siteError = () => {
    site.calculationStatus = 'error'
    site.save()
  }

  // make request
  request(requestCfg, (err, res, json) => {
    // handle response
    if (err || !json || !json.data) {
      console.error('error calculating isochrones: ', err)
      return siteError()
    } else if (json.error) {
      console.error('error calculating isochrones: ', json.error)
      return siteError()
    }

    console.log('successfully calculated isochrones')

    // save isochrones to model
    const polygonsToSave = []
    Object.keys(json.data).forEach((mode) => {
      json.data[mode].features.forEach((feature) => {
        polygonsToSave.push(Object.assign(feature, {
          mode: mode,
          siteId: site._id,
          user: site.user
        }))
      })
    })

    models.Polygon.remove({ siteId: site._id }, (err) => {
      if (err) {
        console.error('error saving polygons')
        console.error(err)
        return siteError()
      }
      models.Polygon.create(polygonsToSave, (err) => {
        if (err) {
          console.error('error saving polygons')
          console.error(err)
          siteError()
        }
      })
    })
    site.calculationStatus = 'successfully'
    site.save((err) => {
      if (err) {
        console.error('error saving site')
        console.error(err)
        siteError()
      }
    })

    // update site's commuters
    models.Commuter.find({ siteId: site._id, trashed: undefined })
      .exec()
      .then((commuters) => {
        console.log(`updating commuter stats for ${commuters.length} commuters`)
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
