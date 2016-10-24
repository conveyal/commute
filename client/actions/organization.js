import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addOrganization = createAction('add organization')
export const createOrganization = (newOrganization) => {
  newOrganization.id = uuid.v4()
  newOrganization.sites = []
  newOrganization.groups = []
  return [
    addOrganization(newOrganization),
    push('/')
  ] // TODO save to server
}

// site stuff
const addSite = createAction('add site')
export const createSite = (newSite) => {
  newSite.id = uuid.v4()
  return [
    addSite(newSite),
    push(`/organizations/${newSite.organizationId}`)
  ] // TODO save to server
}
