import moment from 'moment'
import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addAnalysis = createAction('add analysis')
export const createAnalysis = (newAnalysis, organizationId) => {
  newAnalysis.id = uuid.v4()
  newAnalysis.lastRunDateTime = moment().unix()
  const commuters = newAnalysis.commuters
  delete newAnalysis.commuters
  return [
    addAnalysis({ analysis: newAnalysis, organizationId }),
    push(`/analysis/${newAnalysis.id}`),
    makeMockTrips(newAnalysis.id, organizationId, commuters)
  ] // TODO save to server
}

const deleteLocally = createAction('delete analysis')
/* const deleteOnServer = (id) =>
  serverAction({
    url: `/api/analysis/${id}`,
    options: {
      method: 'delete'
    }
  }) */ // TODO delete on server
export const deleteAnalysis = (id, organizationId) => [
  deleteLocally(id),
  push(`/organization/${organizationId}`)
]

const makeMockTrips = (analysisId, organizationId, commuters) => {
  const trips = []
  const modes = ['bike', 'car', 'transit', 'walk']
  const randRange = () => Math.random() * 0.4 + 0.8
  commuters.forEach((commuter) => {
    const curTrip = {
      commuterId: commuter.id
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
