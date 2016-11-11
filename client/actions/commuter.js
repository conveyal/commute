import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addCommuter = createAction('add commuter')
export const createCommuter = ({commuter, groupId, organizationId}) => {
  commuter.id = uuid.v4()
  return [
    addCommuter({commuter, groupId, organizationId}),
    push(`/organizations/${organizationId}/groups/${groupId}`)
  ] // TODO save to server
}

const deleteLocally = createAction('delete commuter')
/* const deleteOnServer = (id) =>
  serverAction({
    url: `/api/commuter/${id}`,
    options: {
      method: 'delete'
    }
  }) */ // TODO delete on server
export const deleteCommuter = ({commuterId, groupId, organizationId}) => [
  deleteLocally({commuterId, groupId, organizationId}),
  push(`/organizations/${organizationId}/groups/${groupId}`)
]

const updateLocally = createAction('update commuter')
/* const updateOnServer = (id) =>
  serverAction({
    url: `/api/commuter/${id}`,
    options: {
      method: 'update'
    }
  }) */ // TODO update on server
export const updateCommuter = ({commuter, groupId, organizationId}) => [
  updateLocally({commuter, groupId, organizationId}),
  push(`/organizations/${organizationId}/groups/${groupId}`)
]
