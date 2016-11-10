import update from 'react-addons-update'

import {settings} from '../utils/env'
import {arrayToObj, fixedRound} from '../utils/reducers'

const METRICS = Object.keys(settings.metrics)

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
    const organizations = [...state.organizations, ...action.payload]
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
    const updatedOrganization = addEntities(affectedOrganization, 'analyses', [analysis])
    return setOrganization(state, updatedOrganization)
  },
  'delete analysis' (state, action) {
    const {organizationId, analysisId} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    const updatedOrganization = deleteEntity(affectedOrganization, 'analyses', analysisId)
    return setOrganization(state, updatedOrganization)
  },
  'receive mock calculated trips' (state, action) {
    const {analysisId, organizationId, trips} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    const affectedAnalysis = affectedOrganization.analysesById[analysisId]
    let updatedAnalysis = update(affectedAnalysis, {
      trips: { $set: trips }
    })

    // calculate array of values for each metric
    const vals = {}
    const modes = Object.keys(trips[0]).filter((mode) => (['commuterId']).indexOf(mode) === -1)
    modes.forEach((mode) => {
      vals[mode] = {
        cost: [],
        distance: [],
        time: []
      }
    })
    trips.forEach((trip) =>
      modes.forEach((mode) =>
        METRICS.forEach((metric) => {
          vals[mode][metric].push(trip[mode][metric])
        })
      )
    )

    // sort arrays
    modes.forEach((mode) =>
      METRICS.forEach((metric) => {
        vals[mode][metric].sort()
      })
    )

    updatedAnalysis = update(affectedAnalysis, {
      tripVals: { $set: vals }
    })

    // calculate analysis summary metrics
    // Potential Savings is an overall average of the difference in cost between
    // the most likely trip and the driving trip
    const len = trips.length
    let totalCostDifference = 0
    let totalTravelTime = 0
    let totalDistance = 0
    trips.forEach((trip) => {
      totalCostDifference += trip.car.cost - trip.mostLikely.cost
      totalTravelTime += trip.mostLikely.time
      totalDistance += trip.mostLikely.distance
    })

    updatedAnalysis = update(affectedAnalysis, {
      summary: {
        $set: {
          avgTravelTime: fixedRound(totalTravelTime / len),
          avgDistance: fixedRound(totalDistance / len),
          savingsPerTrip: fixedRound(totalCostDifference / len),
          savingsPerTripYear: fixedRound(totalCostDifference / len * 260),
          savingsTotalPerDay: fixedRound(totalCostDifference),
          savingsTotalPerYear: fixedRound(totalCostDifference * 260)
        }
      }
    })

    const updatedOrganization = setEntity(affectedOrganization, 'analyses', updatedAnalysis)
    return setOrganization(state, updatedOrganization)
  },

  /**
   * Commuter Stuff
   */

  'add commuter' (state, action) {
    const {commuter, groupId, organizationId} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    const affectedGroup = affectedOrganization.groupsById[groupId]
    const updatedGroup = addEntities(affectedGroup, 'commuters', [commuter])
    const updatedOrganization = setGroup(affectedOrganization, updatedGroup)
    return setOrganization(state, updatedOrganization)
  },
  'delete commuter' (state, action) {
    const {commuterId, groupId, organizationId} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    const affectedGroup = affectedOrganization.groupsById[groupId]
    const updatedGroup = deleteEntity(affectedGroup, 'commuters', commuterId)
    const updatedOrganization = setGroup(affectedOrganization, updatedGroup)
    return setOrganization(state, updatedOrganization)
  },
  'update commuter' (state, action) {
    const {commuter, groupId, organizationId} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    const affectedGroup = affectedOrganization.groupsById[groupId]
    const updatedGroup = setEntity(affectedGroup, 'commuters', commuter)
    const updatedOrganization = setGroup(affectedOrganization, updatedGroup)
    return setOrganization(state, updatedOrganization)
  },

  /**
   * Group Stuff
   */

  'add group' (state, action) {
    const {organizationId, group} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    const updatedOrganization = addEntities(affectedOrganization, 'groups', [group])
    return setOrganization(state, updatedOrganization)
  },
  'append commuters' (state, action) {
    const {commuters, groupId, organizationId} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    const affectedGroup = affectedOrganization.groupsById[groupId]
    const updatedGroup = addEntities(affectedGroup, 'commuters', commuters)
    const updatedOrganization = setGroup(affectedOrganization, updatedGroup)
    return setOrganization(state, updatedOrganization)
  },
  'delete group' (state, action) {
    const {organizationId, groupId} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    const updatedOrganization = deleteEntity(affectedOrganization, 'groups', groupId)
    return setOrganization(state, updatedOrganization)
  },

  /**
   * Site Stuff
   */

  'add site' (state, action) {
    const {organizationId, site} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    const updatedOrganization = addEntities(affectedOrganization, 'sites', [site])
    return setOrganization(state, updatedOrganization)
  },
  'delete site' (state, action) {
    const {organizationId, siteId} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    const updatedOrganization = deleteEntity(affectedOrganization, 'sites', siteId)
    return setOrganization(state, updatedOrganization)
  },
  'update site' (state, action) {
    const {organizationId, site} = action.payload
    const affectedOrganization = state.organizationsById[organizationId]
    const updatedOrganization = setEntity(affectedOrganization, 'sites', site)
    return setOrganization(state, updatedOrganization)
  }
}

// Utilities

/**
 * Helper to delete an item from a entityById object
 * @param  {String} id  The ID of the entity to delete
 * @return {Function}   A function that deletes the entity from
 *  the object and then returns that object
 */
const deleteFromMap = (id) => (map) => {
  delete map[id]
  return map
}

export const initialState = {
  organizations: [],
  organizationsById: {}
}

/**
 * Add entities to a collection
 *
 * @param {Object} parent           the parent object containing the collections
 * @param {String} entitiesName     base name for entity collection keys
 * @param {Array} entities          the entities to add
 * @return                          The updated parent
 */
const addEntities = (parent, entitiesName, entities) => {
  const entitiesByIdName = `${entitiesName}ById`
  let updatedParent = update(parent, {
    [entitiesName]: { $push: entities }
  })
  return update(updatedParent, {
    [entitiesByIdName]: { $set: arrayToObj(updatedParent[entitiesName]) }
  })
}

/**
 * Delete an entity within a collection
 *
 * @param {Object} parent           the parent object containing the collections
 * @param {String} entitiesName     base name for entity collection keys
 * @param {Object} entityId         ID of the entity to delete
 * @return                          The updated parent
 */
const deleteEntity = (parent, entitiesName, entityId) => {
  const entitiesByIdName = `${entitiesName}ById`
  let updatedParent = update(parent, {
    [entitiesByIdName]: { $apply: deleteFromMap(entityId) }
  })
  return update(updatedParent, {
    [entitiesName]: { $set: Object.values(updatedParent[entitiesByIdName]) }
  })
}

/**
 * Helper to update an entity within a collection
 *
 * @param {Object} parent           the parent object containing the collections
 * @param {String} entitiesName     base name for entity collection keys* @param {Object} updatedEntity    entity to update
 * @return                          The updated parent
 */
const setEntity = (parent, entitiesName, updatedEntity) => {
  const entitiesByIdName = `${entitiesName}ById`
  let updatedParent = update(parent, {
    [entitiesByIdName]: {
      [updatedEntity.id]: {
        $set: updatedEntity
      }
    }
  })
  return update(updatedParent, {
    [entitiesName]: {
      $set: Object.values(updatedParent[entitiesByIdName])
    }
  })
}

const setGroup = (organization, group) => {
  return setEntity(organization, 'groups', group)
}

const setOrganization = (state, organization) => {
  return setEntity(state, 'organizations', organization)
}
