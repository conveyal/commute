import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addGroup = createAction('add group')
const appendCommuters = createAction('append commuters')
export const appendToGroup = (newCommuters, groupId, organizationId) => {
  return [
    appendCommuters({ commuters: newCommuters, groupId, organizationId }),
    push(`/organizations/${organizationId}/group/${groupId}`)
  ] // TODO save to server
}
export const createGroup = (newGroup, organizationId) => {
  newGroup.id = uuid.v4()
  return [
    addGroup({ group: newGroup, organizationId }),
    push(`/organizations/${organizationId}/group/${newGroup.id}`)
  ] // TODO save to server
}

const deleteLocally = createAction('delete group')
/* const deleteOnServer = (id) =>
  serverAction({
    url: `/api/group/${id}`,
    options: {
      method: 'delete'
    }
  }) */ // TODO delete on server
export const deleteGroup = (id, organizationId) => [
  deleteLocally({ groupId: id, organizationId }),
  push(`/organizations/${organizationId}`)
]
