import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addLocally = createAction('add organization')
export const createOrganization = (newOrganization) => {
  newOrganization.id = uuid.v4()
  newOrganization.analyses = []
  newOrganization.groups = []
  newOrganization.sites = []
  return [
    addLocally(newOrganization),
    push(`/organization/${newOrganization.id}`)
  ] // TODO save to server
}

const deleteLocally = createAction('delete organization')
/* const deleteOnServer = (id) =>
  serverAction({
    url: `/api/organization/${id}`,
    options: {
      method: 'delete'
    }
  }) */ // TODO delete on server
export const deleteOrganization = ({agencyId, id}) => [
  deleteLocally({agencyId, id}),
  push(`/agency/${agencyId}`)
]

export const updateOrganization = (organization) => [
  setLocally(organization),
  push(`/organization/${organization.id}`)
]
/* const updateOnServer = (organization) =>
  serverAction({
    url: `/api/organization/${organization.id}`,
    options: {
      body: JSON.stringify(organization),
      method: 'put'
    }
  }) */  // TODO: update on server

export const setLocally = createAction('set organization')
