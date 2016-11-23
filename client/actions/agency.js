import fetchAction from '@conveyal/woonerf/fetch'
import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'
import uuid from 'uuid'

const addLocally = createAction('add agency')
export const createAgency = (newAgency) => {
  newAgency.id = uuid.v4()
  newAgency.organizations = []
  return [
    addLocally(newAgency),
    push(`/agency/${newAgency.id}`)
  ] // TODO save to server
}

const deleteLocally = createAction('delete agency')
/* const deleteOnServer = (id) =>
  serverAction({
    url: `/api/agency/${id}`,
    options: {
      method: 'delete'
    }
  }) */ // TODO delete on server
export const deleteAgency = (id) => [deleteLocally(id), push('/')]

export const loadAgencies = () => fetchAction({
  url: '/api/agency',
  next: (res, err) => {
    if (!err) {
      return setAllLocally(res)
    }
  }
})

export const updateAgency = (agency) => [
  setLocally(agency),
  push(`/agency/${agency.id}`)
]
/* const updateOnServer = (agency) =>
  serverAction({
    url: `/api/agency/${agency.id}`,
    options: {
      body: JSON.stringify(agency),
      method: 'put'
    }
  }) */  // TODO: update on server

export const setLocally = createAction('set agency')
export const setAllLocally = createAction('set agencies')
