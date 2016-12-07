import {createAction} from 'redux-actions'
import makeGenericModelActions from '../utils/actions'

const actions = makeGenericModelActions({
  commands: {
    'Collection GET': {},
    'Collection POST': {},
    'DELETE': {},
    'GET': {}
  },
  parentKey: 'organizationId',
  parentName: 'organization',
  pluralName: 'analyses',
  singularName: 'analysis'
})

actions.makeMockTrips = ({analysisId, organizationId, commuters}) => {
  const trips = []
  const modes = ['bike', 'car', 'transit', 'walk']
  const randRange = () => Math.random() * 0.4 + 0.8
  commuters.forEach((commuter) => {
    const curTrip = {
      commuterId: commuter._id
    }
    const tripMetricBase = Math.random()
    let bestValue = 9999999
    let bestMode
    modes.forEach((mode) => {
      // generate random trips
      const modePctMultiplier = randRange()
      const cost = tripMetricBase * 34.7 * modePctMultiplier * randRange()
      const distance = tripMetricBase * 69 * modePctMultiplier * randRange()
      const time = tripMetricBase * 7500 * modePctMultiplier * randRange()
      curTrip[mode] = {cost, distance, time}
      const tripValue = cost + time * 0.01
      if (tripValue < bestValue) bestMode = mode
    })
    curTrip.mostLikely = Object.assign({ mode: bestMode }, curTrip[bestMode])
    trips.push(curTrip)
  })
  return sendMockTrips({analysisId, organizationId, trips})
}
const sendMockTrips = createAction('receive mock calculated trips')

export default actions
