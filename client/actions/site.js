import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

// site stuff
const addSite = createAction('add site')
export const createSite = (newSite) => {
  newSite.id = uuid.v4()
  return [
    addSite(newSite),
    push(`/organizations/${newSite.organizationId}`)
  ] // TODO save to server
}
