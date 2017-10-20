/* globals describe, expect, it */

import {handleActions} from 'redux-actions'

/**
 * Make test cases for child handler reducers
 *
 * @param  {Object} cfg  An object with parameters structured as follows:
 *   - childPluralName (String): Plural name of child (parent's child id array)
 *   - childSingularName (String): Singular name of child (for making reducer title)
 *   - add and delete: A lookup of handlers and respective configuration for handler.
 *     Both add and delete config must have the following keys:
 *     - affectedParentId: The id of the affected parent entity
 *     - initialState: The inital store state
 *     - payload: The action's payload (entity)
 *   - initialState (optional): overall initial state of store
 *   - reducers: The store reducers
 */
export function makeChildrenHandlerTestCases (cfg) {
  describe(`${cfg.childPluralName} children handler reducer tests`, () => {
    const reducer = handleActions(cfg.reducers, cfg.initialState)

    const addType = `add ${cfg.childSingularName}`
    it(`it should handle ${addType}`, () => {
      const action = { payload: cfg.add.payload, type: addType }
      const result = reducer(cfg.add.initialState, action)
      expect(result[cfg.add.affectedParentId][cfg.childPluralName]).toContain(cfg.add.payload._id)
      expect(result).toMatchSnapshot()
    })

    const deleteType = `delete ${cfg.childSingularName}`
    it(`it should handle ${deleteType}`, () => {
      const action = { payload: cfg.delete.payload, type: deleteType }
      const result = reducer(cfg.delete.initialState, action)
      expect(result[cfg.delete.affectedParentId][cfg.childPluralName]).not.toContain(cfg.delete.payload._id)
      expect(result).toMatchSnapshot()
    })
  })
}

/**
 * Make test cases for generic reducers for an entity type
 *
 * @param  {Object} cfg  An object with parameters structured as follows:
 *   - handlers: A lookup of handlers and respective configuration for handler.
 *     Possible keys: ['add', 'add many', 'delete', 'set', 'set many']
 *     Each handler config must have the following keys: initialState and payload
 *   - initialState (optional): overall initial state of store
 *   - name: must have singular and plural keys with the corresponding strings
 *   - reducers: The store reducers
 */
export function makeGenericReducerTestCases (cfg) {
  describe('generic reducer tests', () => {
    const reducer = handleActions(cfg.reducers, cfg.initialState)

    // Default State Test
    it('should handle default state', () => {
      expect(reducer(undefined, { type: 'blah', payload: 'arglbargle' })).toEqual(cfg.initialState)
    })

    if (cfg.handlers.add) {
      const addType = `add ${cfg.name.singular}`
      it(`should handle ${addType}`, () => {
        const addCfg = cfg.handlers.add
        const entity = addCfg.payload
        const action = { payload: addCfg.payload, type: addType }
        const result = reducer(addCfg.initialState, action)
        expect(result).toEqual({ [entity._id]: entity })
        expect(result).toMatchSnapshot()
      })
    }

    if (cfg.handlers.delete) {
      const deleteType = `delete ${cfg.name.singular}`
      it(`should handle ${deleteType}`, () => {
        const deleteCfg = cfg.handlers.delete
        const entityId = deleteCfg.payload._id
        const action = { payload: deleteCfg.payload, type: deleteType }
        const result = reducer(deleteCfg.initialState, action)
        expect(result[entityId]).toBe(undefined)
        expect(result).toMatchSnapshot()
      })
    }

    if (cfg.handlers['delete many']) {
      const deleteManyType = `delete many ${cfg.name.plural}`
      it(`should handle ${deleteManyType}`, () => {
        const deleteManyCfg = cfg.handlers['delete many']
        const action = { payload: deleteManyCfg.payload, type: deleteManyType }
        const result = reducer(deleteManyCfg.initialState, action)
        expect(result).toMatchSnapshot()
      })
    }

    if (cfg.handlers.set) {
      const setType = `set ${cfg.name.singular}`
      it(`should handle ${setType}`, () => {
        const setCfg = cfg.handlers.set
        const entity = setCfg.payload
        const action = { payload: setCfg.payload, type: setType }
        const result = reducer(setCfg.initialState, action)
        expect(result[entity._id]).toEqual(entity)
        expect(result).toMatchSnapshot()
      })
    }

    if (cfg.handlers['set many']) {
      const setAllType = `set ${cfg.name.plural}`
      it(`should handle ${setAllType}`, () => {
        const setAllCfg = cfg.handlers['set many']
        const firstEntity = setAllCfg.payload[0]
        const action = { payload: setAllCfg.payload, type: setAllType }
        const result = reducer(setAllCfg.initialState, action)
        expect(result[firstEntity._id]).toEqual(firstEntity)
        expect(result).toMatchSnapshot()
      })
    }
  })
}
