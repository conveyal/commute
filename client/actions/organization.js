import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addLocally = createAction('add organization')
export const createOrganization = (newOrganization) => {
  newOrganization.id = uuid.v4()
  newOrganization.sites = []
  newOrganization.groups = []
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
  }) */
export const deleteOrganization = (id) => [deleteLocally(id)]
