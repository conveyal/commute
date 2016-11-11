import moment from 'moment'
import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addAnalysis = createAction('add analysis')
export const createAnalysis = (newAnalysis, organizationId, commuters) => {
  newAnalysis.id = uuid.v4()
  newAnalysis.lastRunDateTime = moment().unix()
  return [
    addAnalysis({ analysis: newAnalysis, organizationId }),
    push(`/organizations/${organizationId}/analysis/${newAnalysis.id}`),
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
  deleteLocally({ analysisId: id, organizationId }),
  push(`/organizations/${organizationId}`)
]

const makeMockTrips = (analysisId, organizationId) => {
  const trips = []
  sendMockTrips({analysisId, organizationId, trips})
}
const sendMockTrips = createAction('receive mock calculated trips')
