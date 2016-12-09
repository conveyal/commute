const queue = require('async/queue')
const request = require('request')

const models = require('../models')

const PROFILE_OPTIONS = {
  accessModes: 'WALK', // BICYCLE,BICYCLE_RENT
  bikeSpeed: 4.1,
  directModes: 'CAR,WALK,BICYCLE', // ,BICYCLE,BICYCLE_RENT',
  egressModes: 'WALK', // ,BICYCLE_RENT',
  endTime: '9:00',
  limit: 1,
  minBikeTime: 0,
  minCarTime: 0,
  maxBikeTime: 180,
  maxCarTime: 180,
  maxWalkTime: 180,
  startTime: '7:00',
  transitModes: 'BUS,TRAINISH',
  walkSpeed: 1.4
}

module.exports = function ({ analysisId, commuters, site }) {
  const sitePosition = `${site.coordinate.lat},${site.coordinate.lng}`
  const tripPlannerQueue = queue((commuter, tripPlanCallback) => {
    const requestCfg = {
      json: true,
      uri: process.env.OTP_URL,
      qs: Object.assign(PROFILE_OPTIONS, {
        from: `${commuter.coordinate.lat},${commuter.coordinate.lng}`,
        to: sitePosition
      })
    }

    request(requestCfg, (err, res, json) => {
      if (err) return tripPlanCallback(err)

      // parse results
      const newTrip = {
        analysisId,
        commuterId: commuter._id
      }
      json.options.forEach((option) => {
        // should only ever be two options
        if (option.summary === 'Non-transit options') {
          calcNonTransitTrips({ newTrip, option })
        } else {
          calcTransitTrip({ newTrip, option })
        }
      })

      console.log(newTrip)
      tripPlanCallback()
    })
  }, 2)

  tripPlannerQueue.drain = () => {
    console.log('drained')
    // models
    //   .Commuter
    //   .find({ analysisId, trashed: undefined })
    //   .exec()
    //   .then((commuters) => {
    //     // caluclate summary statistics
    //     console.log(commuters)
    //   })
    //   .catch((error) => {
    //     console.error('Error finding analysis after profiling commuters', error)
    //   })
  }

  tripPlannerQueue.push(commuters)
}

const modeDbLookup = {
  BICYCLE: 'bike',
  CAR: 'car',
  TRANSIT: 'transit',
  WALK: 'walk'
}

// 0.000621371 miles per meter, 0.54 IRS cents per mile
// assuming 100 times less cost per mile for bicycle
// assuming 1000 times less cost per mile for walk
const monetaryCostCalculationStrategies = {
  BICYCLE: (time, distance, directCost) => distance * 0.000621371 * 0.0054 + (directCost || 0),
  CAR: (time, distance, directCost) => distance * 0.000621371 * 0.54 + (directCost || 0),
  TRANSIT: (time, distance, directCost) => (directCost || 0),
  WALK: (time, distance, directCost) => distance * 0.000621371 * 0.00054 + (directCost || 0)
}

// 0.004 cents per second = $15 / hr
// valuing time in transit less since you can do other stuff
const totalCostCalculationStrategies = {
  BICYCLE: (time, distance, directCost) => time * 0.004 + distance * 0.000621371 * 0.0054 + (directCost || 0),
  CAR: (time, distance, directCost) => time * 0.004 + distance * 0.000621371 * 0.54 + (directCost || 0),
  TRANSIT: (time, distance, directCost) => time * 0.003 + (directCost || 0),
  WALK: (time, distance, directCost) => time * 0.004 + distance * 0.000621371 * 0.00054 + (directCost || 0)
}

function calcNonTransitTrips ({ newTrip, option }) {
  const potentialModes = ['BICYCLE', 'CAR', 'WALK']
  const possibleModes = []
  option.access.forEach((mode) => {
    possibleModes.push(mode.mode)
    // calculate totals from result
    const travelTime = mode.time

    // TODO: generate polyline from steps
    let totalDistance = 0
    mode.streetEdges.forEach((edge) => {
      totalDistance += edge.distance
    })

    newTrip[modeDbLookup[mode.mode]] = {
      distance: totalDistance,
      monetaryCost: monetaryCostCalculationStrategies[mode.mode](travelTime, totalDistance),
      time: travelTime,
      totalCost: totalCostCalculationStrategies[mode.mode](travelTime, totalDistance),
      polygon: 'String',
      possible: true
    }
  })

  potentialModes.forEach((mode) => {
    if (possibleModes.indexOf(mode) === -1) {
      // mode not possible (according to trip planner)
      newTrip[modeDbLookup[mode.mode]] = {
        distance: 9999999,
        monetaryCost: 9999999,
        time: 9999999,
        totalCost: 9999999,
        polygon: 'String',
        possible: false
      }
    }
  })
}

function calcTransitTrip ({ newTrip, option }) {

}
