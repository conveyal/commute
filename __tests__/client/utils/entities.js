/* globals describe, expect, it */

import * as entities from '../../../client/utils/entities'

describe('utils > entities', () => {
  const entity = { _id: '1' }
  const entityArray = [entity]

  it('addToEntityMap should work', () => {
    const initialState = {}
    expect(entities.addToEntityMap(initialState, entity)).toEqual({ '1': entity })
    expect(initialState).toEqual({})
  })

  it('addEntitiesToEntityMap should work', () => {
    const initialState = {}
    expect(entities.addEntitiesToEntityMap(initialState, entityArray)).toEqual({ '1': entity })
    expect(initialState).toEqual({})
  })

  it('deleteFromEntityMap should work', () => {
    const initialState = { '1': { _id: '1' } }
    expect(entities.deleteFromEntityMap(initialState, '1')).toEqual({})
    expect(initialState).toEqual({ '1': { _id: '1' } })
  })

  it('deleteManyFromEntityMap should work', () => {
    const initialState = { '1': { _id: '1', parentId: '2' } }
    expect(entities.deleteManyFromEntityMap(initialState, { parentId: '2' })).toEqual({})
    expect(initialState).toEqual({ '1': { _id: '1', parentId: '2' } })
  })

  it('entityArrayToEntityIdArray should work', () => {
    expect(entities.entityArrayToEntityIdArray(entityArray)).toEqual(['1'])
  })

  it('entityArrayToEntityMap should work', () => {
    expect(entities.entityArrayToEntityMap(entityArray)).toEqual({ '1': { _id: '1' } })
  })

  it('entityIdArrayToEntityArray should work', () => {
    const entityIdArray = ['1']
    const entityMap = { '1': { _id: '1' } }
    expect(entities.entityIdArrayToEntityArray(entityIdArray, entityMap)).toEqual([{ _id: '1' }])
  })

  it('entityIdArrayToEntityArray should not add undefined entities', () => {
    const entityIdArray = ['2']
    const entityMap = { '1': { _id: '1' } }
    expect(entities.entityIdArrayToEntityArray(entityIdArray, entityMap)).toEqual([])
  })
})
