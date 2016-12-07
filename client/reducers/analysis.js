import update from 'react-addons-update'

import analysisDefaults from '../utils/analysisDefaults'
import {fixedRound} from '../utils/common'
import {addToEntityMap} from '../utils/entities'
import {makeGenericReducerHandlers} from '../utils/reducers'

const METRICS = Object.keys(analysisDefaults.metrics)

export const reducers = makeGenericReducerHandlers({
  handlers: ['add', 'delete', 'set many'],
  name: {
    singular: 'analysis',
    plural: 'analyses'
  }
})

reducers['receive mock calculated trips'] = function (state, action) {
  const {analysisId, trips} = action.payload
  const affectedAnalysis = state[analysisId]
  let updatedAnalysis = update(affectedAnalysis, {
    trips: { $set: trips }
  })

  // calculate array of values for each metric
  const vals = {}
  const modes = Object.keys(trips[0]).filter((mode) => (['commuterId']).indexOf(mode) === -1)
  modes.forEach((mode) => {
    vals[mode] = {
      cost: [],
      distance: [],
      time: []
    }
  })
  trips.forEach((trip) =>
    modes.forEach((mode) =>
      METRICS.forEach((metric) => {
        vals[mode][metric].push(trip[mode][metric])
      })
    )
  )

  // sort arrays
  modes.forEach((mode) =>
    METRICS.forEach((metric) => {
      vals[mode][metric].sort()
    })
  )

  updatedAnalysis = update(updatedAnalysis, {
    tripVals: { $set: vals }
  })

  // calculate analysis summary metrics
  // Potential Savings is an overall average of the difference in cost between
  // the most likely trip and the driving trip
  const len = trips.length
  let totalCostDifference = 0
  let totalTravelTime = 0
  let totalDistance = 0
  trips.forEach((trip) => {
    totalCostDifference += trip.car.cost - trip.mostLikely.cost
    totalTravelTime += trip.mostLikely.time
    totalDistance += trip.mostLikely.distance
  })

  updatedAnalysis = update(updatedAnalysis, {
    summary: {
      $set: {
        avgTravelTime: fixedRound(totalTravelTime / len),
        avgDistance: fixedRound(totalDistance / len),
        savingsPerTrip: fixedRound(totalCostDifference / len),
        savingsPerTripYear: fixedRound(totalCostDifference / len * 260),
        savingsTotalPerDay: fixedRound(totalCostDifference),
        savingsTotalPerYear: fixedRound(totalCostDifference * 260)
      }
    }
  })

  return addToEntityMap(state, updatedAnalysis)
}

export const initialState = {}
