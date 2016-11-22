import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addGroup = createAction('add group')
const appendCommuters = createAction('append commuters')
export const appendToGroup = ({ newCommuters, groupId }) => {
  newCommuters = newCommuters.map((commuter) => {
    commuter.groupId = groupId
    return commuter
  })
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
  } else {
    newGroup.commuters = newGroup.commuters.map((commuter) => {
      commuter.groupId = newGroup.id
      return commuter
    })
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

const updateLocally = createAction('set group')
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
