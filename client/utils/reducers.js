import {addToEntityMap, deleteFromEntityMap, entityArrayToEntityMap} from './entities'

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
