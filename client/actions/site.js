import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addSite = createAction('add site')
export const createSite = (newSite, organizationId) => {
  newSite.id = uuid.v4()
  return [
    addSite({ organizationId, site: newSite }),
    push(`/organizations/${organizationId}`)
  ] // TODO save to server
}

const deleteLocally = createAction('delete site')
/* const deleteOnServer = (id) =>
  serverAction({
    url: `/api/site/${id}`,
    options: {
      method: 'delete'
    }
  }) */ // TODO delete on server
export const deleteSite = (id, organizationId) => [
  deleteLocally(id),
  push(`/organizations/${organizationId}`)
]

const updateLocally = createAction('update site')
/* const updateOnServer = (id) =>
  serverAction({
    url: `/api/site/${id}`,
    options: {
      method: 'update'
    }
  }) */ // TODO update on server
export const updateSite = (organizationId, site) => [
  updateLocally(site),
  push(`/organizations/${organizationId}`)
]
