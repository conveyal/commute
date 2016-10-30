import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addLocally = createAction('add organization')
export const createOrganization = (newOrganization) => {
  newOrganization.id = uuid.v4()
  newOrganization.analyses = []
  newOrganization.analysesById = {}
  newOrganization.sites = []
  newOrganization.sitesById = {}
  newOrganization.groups = []
  newOrganization.groupsById = {}
  return [
    addLocally(newOrganization),
    push('/')
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
export const deleteOrganization = (id) => [deleteLocally(id)]

export const updateOrganization = (organization) => [setLocally(organization)]
/* const updateOnServer = (organization) =>
  serverAction({
    url: `/api/organization/${organization.id}`,
    options: {
      body: JSON.stringify(organization),
      method: 'put'
    }
  }) */  // TODO: update on server

export const setLocally = createAction('set organization')
