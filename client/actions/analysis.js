import moment from 'moment'
import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addAnalysis = createAction('add analysis')
export const createAnalysis = (newAnalysis, organizationId) => {
  newAnalysis.id = uuid.v4()
  newAnalysis.lastRunDateTime = moment().unix()
  newAnalysis.trips = []
  return [
    addAnalysis({ analysis: newAnalysis, organizationId }),
    push(`/organizations/${organizationId}/analysis/${newAnalysis.id}`)
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
export const deleteAnalysis = (id, organzationId) => [
  deleteLocally({ analysisId: id, organzationId }),
  push(`/organizations/${organzationId}`)
]
