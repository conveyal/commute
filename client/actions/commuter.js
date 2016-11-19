import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addCommuter = createAction('add commuter')
export const createCommuter = (commuter, groupId) => {
  commuter.groupId = groupId
  commuter.id = uuid.v4()
  return [
    addCommuter(commuter),
    push(`/group/${groupId}`)
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
export const deleteCommuter = (commuterId, groupId) => [
  deleteLocally(commuterId),
  push(`/group/${groupId}`)
]

const updateLocally = createAction('update commuter')
/* const updateOnServer = (id) =>
  serverAction({
    url: `/api/commuter/${id}`,
    options: {
      method: 'update'
    }
  }) */ // TODO update on server
export const updateCommuter = (commuter, groupId) => [
  updateLocally(commuter),
  push(`/group/${groupId}`)
]
