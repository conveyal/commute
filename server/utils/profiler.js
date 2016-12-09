const queue = require('async/queue')
const request = require('request')

const models = require('../models')

const modeDbLookup = {
  BICYCLE: 'bike',
  CAR: 'car',
  TRANSIT: 'transit',
  WALK: 'walk'
}

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
  const allTrips = []

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

      // calculate most likely trip
      let bestMode
      let lowestCost = Infinity
      Object.values(modeDbLookup).forEach((mode) => {
        const curCost = newTrip[mode].virtualCost
        if (curCost < lowestCost) {
          bestMode = mode
          lowestCost = newTrip[mode].virtualCost
        }
      })

      newTrip.mostLikely = Object.assign({ mode: bestMode }, newTrip[bestMode])

      // save new trip
      models.Trip.create(newTrip, (err, data) => {
        if (err) console.error(err)
        tripPlanCallback()
      })
      allTrips.push(newTrip)
    })
  }, 2)

  tripPlannerQueue.drain = () => {
    // caluclate summary statistics
    let travelTimeSum = 0
    let distanceSum = 0 // calculated with only driving
    let savingsTotalPerDay = 0
    const numTrips = allTrips.length

    allTrips.forEach((trip) => {
      const {mostLikely} = trip
      travelTimeSum += mostLikely.time
      distanceSum += trip.car.time
      savingsTotalPerDay += trip.car.monetaryCost - mostLikely.monetaryCost
    })

    models.Analysis.findByIdAndUpdate(analysisId, {
      calculationStatus: 'calculated',
      summary: {
        avgTravelTime: travelTimeSum / numTrips,
        avgDistance: distanceSum / numTrips,
        savingsPerTrip: savingsTotalPerDay / numTrips,
        savingsPerTripYear: savingsTotalPerDay / numTrips * 365.2422,
        savingsTotalPerDay: savingsTotalPerDay,
        savingsTotalPerYear: savingsTotalPerDay * 365.2422
      }
    }).exec()
  }

  tripPlannerQueue.push(commuters)
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
const virtualCostCalculationStrategies = {
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
    const {directCost, totalDistance, travelTime} = calcMetricsFromMode(mode)

    newTrip[modeDbLookup[mode.mode]] = {
      distance: totalDistance,
      monetaryCost: monetaryCostCalculationStrategies[mode.mode](travelTime, totalDistance, directCost),
      time: travelTime,
      virtualCost: virtualCostCalculationStrategies[mode.mode](travelTime, totalDistance, directCost),
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
        virtualCost: 9999999,
        polyline: '',
        possible: false
      }
    }
  })
}

function calcTransitTrip ({ newTrip, option }) {
  const fareCost = option.fares.reduce((prev, fare) => fare.peak + prev, 0)

  const segmentMetrics = [option.access[0], option.egress[0]].map(calcMetricsFromMode)
  option.transit.forEach((transitSegment) => {
    segmentMetrics.push({
      totalDistance: transitSegment.walkDistance, // profiler doesn't include transit distance :(
      travelTime: transitSegment.walkTime + transitSegment.waitStats.avg + transitSegment.rideStats.avg
    })
  })

  // add all segments
  let totalDistance = 0
  let travelTime = 0
  segmentMetrics.forEach((segment) => {
    totalDistance += segment.totalDistance
    travelTime += segment.travelTime
  })

  newTrip.transit = {
    distance: totalDistance,
    monetaryCost: monetaryCostCalculationStrategies['TRANSIT'](travelTime, totalDistance, fareCost),
    time: travelTime,
    virtualCost: virtualCostCalculationStrategies['TRANSIT'](travelTime, totalDistance, fareCost),
    possible: true
  }
}

function calcMetricsFromMode (mode) {
  let totalDistance = 0
  mode.streetEdges.forEach((edge) => {
    totalDistance += edge.distance
  })

  return {
    directCost: 0,
    totalDistance,
    travelTime: mode.time
  }
}
