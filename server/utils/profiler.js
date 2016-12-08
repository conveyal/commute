const queue = require('async/queue')
const request = require('request')

const models = require('../models')

const PROFILE_OPTIONS = {
  accessModes: 'WALK,CAR_PARK', // BICYCLE,BICYCLE_RENT
  bikeSafe: 1000,
  bikeSpeed: 4.1,
  directModes: 'CAR,WALK', // ,BICYCLE,BICYCLE_RENT',
  egressModes: 'WALK', // ,BICYCLE_RENT',
  endTime: '9:00',
  startTime: '7:00',
  limit: 2,
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

    request(requestCfg,
      (err, res, json) => {
        if (err) return tripPlanCallback(err)
        console.log(json)
        tripPlanCallback()
      }
    )
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
