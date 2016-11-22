import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addCommuter = createAction('add commuter')
export const createCommuter = (commuter) => {
  commuter.id = uuid.v4()
  return [
    addCommuter(commuter),
    push(`/group/${commuter.groupId}`)
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
export const deleteCommuter = ({ id, groupId }) => [
  deleteLocally({ id, groupId }),
  push(`/group/${groupId}`)
]

const updateLocally = createAction('set commuter')
/* const updateOnServer = (id) =>
  serverAction({
    url: `/api/commuter/${id}`,
    options: {
      method: 'update'
    }
  }) */ // TODO update on server
export const updateCommuter = (commuter) => [
  updateLocally(commuter),
  push(`/group/${commuter.groupId}`)
]
