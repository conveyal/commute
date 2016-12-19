import analysisDefaults from '../utils/analysisDefaults'
import {addEntitiesToEntityMap, addToEntityMap} from '../utils/entities'
import {makeGenericReducerHandlers} from '../utils/reducers'

const METRICS = Object.keys(analysisDefaults.metrics)
const MODES = Object.keys(analysisDefaults.modeDisplay)

export const reducers = makeGenericReducerHandlers({
  handlers: ['add', 'delete'],
  name: {
    singular: 'analysis',
    plural: 'analyses'
  }
})

reducers['set analysis'] = function (state, action) {
  return addToEntityMap(state, parseAnalysis(action.payload))
}

reducers['set analyses'] = function (state, action) {
  return addEntitiesToEntityMap(state, action.payload.map(parseAnalysis))
}

function parseAnalysis (analysis) {
  // calculate whether all trips have been calculated
  if (analysis.numCommuters === analysis.trips.length) {
    // done calculating
    // calculate array of values for each metric
    const tripVals = {}
    MODES.forEach((mode) => {
      tripVals[mode] = {
        monetaryCost: [],
        distance: [],
        time: []
      }
    })
    analysis.trips.forEach((trip) =>
      MODES.forEach((mode) =>
        METRICS.forEach((metric) => {
          tripVals[mode][metric].push(trip[mode][metric])
        })
      )
    )

    // sort arrays
    MODES.forEach((mode) =>
      METRICS.forEach((metric) => {
        tripVals[mode][metric].sort()
      })
    )

    analysis.tripVals = tripVals
  }

  return analysis
}

export const initialState = {}
