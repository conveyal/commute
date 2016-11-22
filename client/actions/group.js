import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addGroup = createAction('add group')
const appendCommuters = createAction('append commuters')
export const appendToGroup = ({ newCommuters, groupId }) => {
  return [
    appendCommuters({ commuters: newCommuters, groupId }),
    push(`/group/${groupId}`)
  ] // TODO save to server
}
export const createGroup = (newGroup) => {
  newGroup.id = uuid.v4()
  newGroup.allAddressesGeocoded = false
  if (!newGroup.commuters) {
    newGroup.commuters = []
  }
  return [
    addGroup(newGroup),
    push(`/group/${newGroup.id}`)
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
export const deleteGroup = ({ id, organizationId }) => [
  deleteLocally({ id, organizationId }),
  push(`/organization/${organizationId}`)
]

const updateLocally = createAction('update group')
/* const updateOnServer = (id) =>
  serverAction({
    url: `/api/group/${id}`,
    options: {
      method: 'update'
    }
  }) */ // TODO update on server
export const updateGroup = (group) => [
  updateLocally(group)
]
