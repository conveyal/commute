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
    [newEntity._id]: {
      $set: newEntity
    }
  })
}

/**
 * Add a many new entity to a entity map
 *
 * @param {Object} map          The entity map to add the entities to
 * @param {Object} newEntities  The new entities
 * @return {Object}             The updated entity map
 */
export function addEntitiesToEntityMap (map, newEntities) {
  let updatedMap = map
  newEntities.forEach((entity) => {
    updatedMap = addToEntityMap(updatedMap, entity)
  })
  return updatedMap
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
  return arr.map((entity) => entity._id)
}

/**
 * Create an entity map from an array of entities
 *
 * @param  {Array} arr The array of entities
 * @return {Object}    An entity map
 */
export function entityArrayToEntityMap (arr) {
  const obj = {}
  for (let i = 0; i < arr.length; i++) obj[arr[i]._id] = arr[i]
  return obj
}

/**
 * Get the entities corresponding to a list of entity ids
 * entities not found in store will not be added to output array
 *
 * @param  {Array} entityIdArray An array of ids
 * @param  {Object} entityMap    The entity map to lookup the objects from
 * @return {Array}               An array of entities
 */
export function entityIdArrayToEntityArray (entityIdArray, entityMap) {
  const entities = []
  entityIdArray = entityIdArray || []
  for (let i = 0; i < entityIdArray.length; i++) {
    const curId = entityIdArray[i]
    if (entityMap[curId]) {
      entities.push(entityMap[curId])
    }
  }
  return entities
}
