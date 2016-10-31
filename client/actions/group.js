import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

// site stuff
const addGroup = createAction('add group')
export const createGroup = (newGroup) => {
  newGroup.id = uuid.v4()
  return [
    addGroup(newGroup),
    push(`/organizations/${newGroup.organizationId}/group/${newGroup.id}`)
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
export const deleteGroup = (id, organzationId) => [
  deleteLocally(id),
  push(`/organizations/${organzationId}`)
]
