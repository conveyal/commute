const queue = require('async/queue')
const moment = require('moment')
const request = require('request')
const qs = require('qs')

const models = require('../models')
const env = require('../utils/env').env

const modeDbLookup = {
  BICYCLE: 'bike',
  CAR: 'car',
  TRANSIT: 'transit',
  WALK: 'walk'
}

const PROFILE_OPTIONS = {
  accessModes: 'WALK', // BICYCLE,BICYCLE_RENT
  bikeSpeed: 4.1,
  date: moment().format('YYYY-MM-DD'), // TODO: choose date to avoid holiday schedule
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

const maxAttempts = 5

module.exports = function ({ analysisId, commuters, site }) {
  const sitePosition = `${site.coordinate.lat},${site.coordinate.lon}`
  const allTrips = []
  const attemptsPerCommuter = {}

  const tripPlannerPromise = new Promise((resolve, reject) => {
    // create queue for trip plan calculations
    const tripPlannerQueue = queue((commuter, tripPlanCallback) => {
      console.log('profile commuter', commuter._id)
      console.log(`${env.OTP_URL}/plan?` + qs.stringify(Object.assign(PROFILE_OPTIONS, {
        from: `${commuter.coordinate.lat},${commuter.coordinate.lon}`,
        to: sitePosition
      })))
      const requestCfg = {
        json: true,
        uri: `${env.OTP_URL}/plan`,
        qs: Object.assign(PROFILE_OPTIONS, {
          from: `${commuter.coordinate.lat},${commuter.coordinate.lon}`,
          to: sitePosition
        })
      }

      const commuterId = commuter._id

      const retryCommuterCalc = (err) => {
        console.error('error calculating trip')
        console.error(err)
        if (attemptsPerCommuter[commuterId] && attemptsPerCommuter[commuterId] < maxAttempts) {
          console.log(`add commuter ${commuterId} back to queue to retry`)
          tripPlannerQueue.push(commuter)
        } else {
          console.error(`maximum retries reached for commuter ${commuterId}`)
        }
      }

      // tally attempts per commuter
      if (attemptsPerCommuter[commuterId]) {
        attemptsPerCommuter[commuterId]++
      } else {
        attemptsPerCommuter[commuterId] = 1
      }

      request(requestCfg, (err, res, json) => {
        if (err || !json) {
          tripPlanCallback()
          if (!err && !json) {
            err = 'invalid json response received'
          }
          return retryCommuterCalc(err)
        }

        // parse results
        const newTrip = {
          analysisId,
          commuterId
        }

        // sometimes it's profile, other times it's
        let profileOptionsKey
        if (json.profile) {
          profileOptionsKey = 'profile'
        } else if (json.options) {
          profileOptionsKey = 'options'
        }

        // set everything to impossible at first to avoid later errors
        Object.keys(modeDbLookup).forEach((mode) => {
          newTrip[modeDbLookup[mode]] = {
            distance: 9999999,
            monetaryCost: 9999999,
            time: 9999999,
            virtualCost: 9999999,
            polyline: '',
            possible: false
          }
        })

        if (json[profileOptionsKey]) {
          json[profileOptionsKey].forEach((option) => {
            // should only ever be two options
            if (option.summary === 'Non-transit options') {
              calcNonTransitTrips({ newTrip, option })
            } else {
              calcTransitTrip({ newTrip, option })
            }
          })
        }

        // calculate most likely trip
        let bestMode
        let lowestCost = Infinity
        Object.keys(modeDbLookup).forEach((otpModeKey) => {
          const dbModeKey = modeDbLookup[otpModeKey]
          const curCost = newTrip[dbModeKey].virtualCost
          if (curCost < lowestCost) {
            bestMode = dbModeKey
            lowestCost = newTrip[dbModeKey].virtualCost
          }
        })

        newTrip.mostLikely = Object.assign({ mode: bestMode }, newTrip[bestMode])

        // save new trip
        models.Trip.create(newTrip, (err, data) => {
          if (err) return retryCommuterCalc(err)
          console.log(`new trip created for commuter ${commuterId}`)
          allTrips.push(newTrip)
          tripPlanCallback()
        })
      })
    }, 2)
    // end trip planner queue definition

    tripPlannerQueue.drain = () => {
      console.log('done profiling all commuters, calculating stats')
      // caluclate summary statistics
      let travelTimeSum = 0
      let distanceSum = 0 // calculated with only driving
      let savingsTotalPerDay = 0
      const numTrips = allTrips.length
      let numPossibleTrips = 0

      allTrips.forEach((trip) => {
        const {mostLikely} = trip
        if (mostLikely.time < 9999999) {
          travelTimeSum += mostLikely.time
          distanceSum += trip.car.distance
          numPossibleTrips++
        }
        savingsTotalPerDay += (
          trip.car.monetaryCost === 9999999
          ? mostLikely.monetaryCost
          : trip.car.monetaryCost
        ) - mostLikely.monetaryCost
      })

      models.Analysis.findByIdAndUpdate(analysisId, {
        calculationStatus: 'calculated',
        summary: {
          avgTravelTime: travelTimeSum / numPossibleTrips,
          avgDistance: distanceSum / numPossibleTrips,
          savingsPerTrip: savingsTotalPerDay / numTrips,
          savingsPerTripYear: savingsTotalPerDay / numTrips * 365.2422,
          savingsTotalPerDay: savingsTotalPerDay,
          savingsTotalPerYear: savingsTotalPerDay * 365.2422
        }
      })
        .then(resolve)
        .catch(reject)
    }

    tripPlannerQueue.push(commuters)
  })

  return tripPlannerPromise
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
      newTrip[modeDbLookup[mode]] = {
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
  const fareCost = option.fares.reduce((prev, fare) => (fare && fare.peak ? fare.peak : 0) + prev, 0)

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
