import fetchAction from '@conveyal/woonerf/fetch'
import {push} from 'react-router-redux'
import {createAction} from 'redux-actions'

const addLocally = createAction('add agency')

export const createAgency = (newAgency) => {
  newAgency.organizations = []
  return fetchAction({
    next: (res, err) => {
      if (err) {
        // TODO handle error
      } else {
        const createdAgency = res.value
        return [
          addLocally(createdAgency),
          push(`/agency/${createdAgency._id}`)
        ]
      }
    },
    options: {
      body: newAgency,
      method: 'POST'
    },
    url: '/api/agency'
  })
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
  next: (res, err) => {
    if (!err) {
      return setAllLocally(res.value)
    }
    // TODO handle error
  },
  url: '/api/agency'
})

export const updateAgency = (agency) => [
  setLocally(agency),
  push(`/agency/${agency._id}`)
]
/* const updateOnServer = (agency) =>
  serverAction({
    url: `/api/agency/${agency._id}`,
    options: {
      body: JSON.stringify(agency),
      method: 'put'
    }
  }) */  // TODO: update on server

export const setLocally = createAction('set agency')
export const setAllLocally = createAction('set agencies')
