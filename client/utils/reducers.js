import update from 'react-addons-update'

import {addToEntityMap, deleteFromEntityMap, entityArrayToEntityMap} from './entities'

/**
 * Make handlers for children creation and deletion events
 *
 * @param  {Object} cfg  An configuration object structured as follows:
 *   - childPluralName (String): Plural name of child (parent's child id array)
 *   - childSingularName (String): Singular name of child (for making reducer title)
 *   - parentIdField (String): Id field of parent in child entity
 * @return {Object}     Reducers
 */
export function makeChildrenHandlers (cfg) {
  const reducers = {}
  reducers[`add ${cfg.childSingularName}`] = function (state, action) {
    const newEntity = action.payload
    return update(state, {
      [newEntity[cfg.parentIdField]]: {
        [cfg.childPluralName]: {
          $push: [newEntity.id]
        }
      }
    })
  }

  reducers[`delete ${cfg.childSingularName}`] = function (state, action) {
    const entity = action.payload
    const childIds = state[entity[cfg.parentIdField]][cfg.childPluralName]
    return update(state, {
      [entity[cfg.parentIdField]]: {
        [cfg.childPluralName]: {
          $set: childIds.filter((id) => id !== entity.id)
        }
      }
    })
  }

  return reducers
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
