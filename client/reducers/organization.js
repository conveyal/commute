import update from 'react-addons-update'

import {arrayToObj} from '../utils/reducers'

export const reducers = {

  /**
   * Organization Stuff
   */

  'add organization' (state, action) {
    const organizations = [...state.organizations, action.payload]
    return {
      ...state,
      organizations,
      organizationsById: arrayToObj(organizations)
    }
  },
  'delete organization' (state, action) {
    const organizationsById = state.organizationsById
    delete organizationsById[action.payload]
    const organizations = Object.values(organizationsById)
    return {
      ...state,
      organizations,
      organizationsById
    }
  },
  'set organizations' (state, action) {
    const organizations = [...state.organizations, action.payload]
    return {
      ...state,
      organizations,
      organizationsById: arrayToObj(action.payload)
    }
  },

  /**
   * Analysis Stuff
   */

  'add analysis' (state, action) {
    const {organizationId, analysis} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    let updatedOrganization = update(affectedOrganization, {
      analyses: { $push: [analysis] }
    })
    updatedOrganization = update(updatedOrganization, {
      analysesById: { $set: arrayToObj(updatedOrganization.analyses) }
    })
    return setOrganization(state, updatedOrganization)
  },
  'delete analysis' (state, action) {
    const {organizationId, analysisId} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    let updatedOrganization = update(affectedOrganization, {
      analysesById: { $apply: deleteFromMap(analysisId) }
    })
    updatedOrganization = update(updatedOrganization, {
      analyses: { $set: Object.values(updatedOrganization.analysesById) }
    })
    return setOrganization(state, updatedOrganization)
  },
  'receive mock calculated trips' (state, action) {
    throw new Error('unimplemented')
  },

  /**
   * Commuter Stuff
   */

  'add commuter' (state, action) {
    throw new Error('unimplemented')
  },
  'delete commuter' (state, action) {
    throw new Error('unimplemented')
  },
  'update commuter' (state, action) {
    throw new Error('unimplemented')
  },

  /**
   * Group Stuff
   */

  'add group' (state, action) {
    const {organizationId, group} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    let updatedOrganization = update(affectedOrganization, {
      groups: { $push: [group] }
    })
    updatedOrganization = update(updatedOrganization, {
      groupsById: { $set: arrayToObj(updatedOrganization.groups) }
    })
    return setOrganization(state, updatedOrganization)
  },
  'append commuters' (state, action) {
    throw new Error('unimplemented')
  },
  'delete group' (state, action) {
    throw new Error('unimplemented')
  },

  /**
   * Site Stuff
   */

  'add site' (state, action) {
    const {organizationId, site} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    let updatedOrganization = update(affectedOrganization, {
      sites: { $push: [site] }
    })
    updatedOrganization = update(updatedOrganization, {
      sitesById: { $set: arrayToObj(updatedOrganization.sites) }
    })
    return setOrganization(state, updatedOrganization)
  },
  'delete site' (state, action) {
    throw new Error('unimplemented')
  },
  'update site' (state, action) {
    throw new Error('unimplemented')
  }
}

// processing trips into values arrays
// // calculate array of values for each metric
// this.vals = {}
// const trips = this.props.analysis.trips
// const modes = Object.keys(trips[0]).filter((mode) => (['commuterId']).indexOf(mode) === -1)
// modes.forEach((mode) => {
//   this.vals[mode] = {
//     cost: [],
//     distance: [],
//     time: []
//   }
// })
// trips.forEach((trip) =>
//   modes.forEach((mode) =>
//     METRICS.forEach((metric) => {
//       this.vals[mode][metric].push(trip[mode][metric])
//     })
//   )
// )
//
// // sort arrays
// modes.forEach((mode) =>
//   METRICS.forEach((metric) => {
//     this.vals[mode][metric].sort()
//   })
// )
//
// newState.series = series

const deleteFromMap = (id) => (map) => {
  delete map[id]
  return map
}

export const initialState = {
  organizations: [],
  organizationsById: {}
}

const setOrganization = (state, updatedOrganization) => {
  let updatedState = update(state, {
    organizationsById: {
      [updatedOrganization.id]: {
        $set: updatedOrganization
      }
    }
  })
  return update(updatedState, {
    organizations: {
      $set: Object.values(updatedState.organizationsById)
    }
  })
}
