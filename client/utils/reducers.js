import update from 'react-addons-update'

/**
 * An entity is an object that has an id attribute
 * An entity map is a lookup of entities by id
 */

/**
 * Add a new entity to a entity map
 *
 * @param {Object} map       The entity map to add the entity to
 * @param {Object} newEntity The new entity
 * @return {Object}          The updated entity map
 */
export function addToEntityMap (map, newEntity) {
  return update(map, {
    [newEntity.id]: {
      $set: newEntity
    }
  })
}

/**
* Delete an entity from an entity map
*
* @param {Object} map      The entity map
* @param {String} entityId The id of the entity to delete
* @return {Object}         The updated entity map
 */
export function deleteFromEntityMap (map, entityId) {
  return update(map, {
    $apply: (obj) => {
      delete obj[entityId]
      return obj
    }
  })
}

/**
 * Title says it all
 *
 * @param  {Array} arr The entity array
 * @return {Array}     An array of entity ids
 */
export function entityArrayToEntityIdArray (arr) {
  return arr.map((entity) => entity.id)
}

/**
 * Create an entity map from an array of entities
 *
 * @param  {Array} arr The array of entities
 * @return {Object}    An entity map
 */
export function entityArrayToEntityMap (arr) {
  const obj = {}
  for (let i = 0; i < arr.length; i++) obj[arr[i].id] = arr[i]
  return obj
}

/**
 * Round a number to a fixed amount of decimal places
 *
 * @param  {Number} n      The number to round
 * @param  {Number} places The number of places to round to (default=2)
 * @return {Number}        The rounded number
 */
export function fixedRound (n, places) {
  places = places || 2
  const multiplier = Math.pow(10, places)
  return Math.round(n * multiplier) / multiplier
}

/**
 * Make generic reducers for an entity type
 *
 * @param  {Object} cfg  An object with name and handlers parameters structured as follows:
 *   - name: must have singular and plural keys with the corresponding strings
 *   - handlers: An array of strings of handlers.  Possible values: ['add', 'delete', 'set', 'set all']
 * @return {Object}      The generated reducers
 */
export function makeGenericReducerHandlers (cfg) {
  const reducers = {}
  if (cfg.handlers.indexOf('add') !== -1) {
    reducers[`add ${cfg.name.singular}`] = function (state, action) {
      return addToEntityMap(state, action.payload)
    }
  }

  if (cfg.handlers.indexOf('delete') !== -1) {
    reducers[`delete ${cfg.name.singular}`] = function (state, action) {
      return deleteFromEntityMap(state, action.payload)
    }
  }

  if (cfg.handlers.indexOf('set') !== -1) {
    reducers[`set ${cfg.name.singular}`] = function (state, action) {
      return addToEntityMap(state, action.payload)
    }
  }

  if (cfg.handlers.indexOf('set all') !== -1) {
    reducers[`set ${cfg.name.plural}`] = function (state, action) {
      return entityArrayToEntityMap(action.payload)
    }
  }

  return reducers
}
