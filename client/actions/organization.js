import {createAction} from 'redux-actions'
import {push} from 'react-router-redux'
import uuid from 'uuid'

const addOrganization = createAction('add organization')
export const create = (o) => {
  o.id = uuid.v4()
  o.sites = []
  o.groups = []
  return [
    addOrganization(o),
    push('/')
  ] // TODO save to server
}
