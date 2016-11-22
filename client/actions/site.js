import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addSite = createAction('add site')
export const createSite = (newSite) => {
  newSite.id = uuid.v4()
  return [
    addSite(newSite),
    push(`/organization/${newSite.organizationId}`)
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
export const deleteSite = ({id, organizationId}) => [
  deleteLocally({id, organizationId}),
  push(`/organization/${organizationId}`)
]

const updateLocally = createAction('update site')
/* const updateOnServer = (id) =>
  serverAction({
    url: `/api/site/${id}`,
    options: {
      method: 'update'
    }
  }) */ // TODO update on server
export const updateSite = (site) => [
  updateLocally(site),
  push(`/organization/${site.organizationId}`)
]
