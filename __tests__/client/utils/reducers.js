/* globals describe, expect, it */

import * as reducers from '../../../client/utils/reducers'

describe('utils > reducers', () => {
  const entity = { id: '1' }
  const entityArray = [entity]

  it('addToEntityMap should work', () => {
    const initialState = {}
    expect(reducers.addToEntityMap(initialState, entity)).toEqual({ '1': entity })
    expect(initialState).toEqual({})
  })

  it('deleteFromEntityMap should work', () => {
    const initialState = { '1': { id: '1' } }
    expect(reducers.deleteFromEntityMap(initialState, '1')).toEqual({})
    expect(initialState).toEqual({ '1': { id: '1' } })
  })

  it('entityArrayToEntityIdArray should work', () => {
    expect(reducers.entityArrayToEntityIdArray(entityArray)).toEqual(['1'])
  })

  it('entityArrayToEntityMap should work', () => {
    expect(reducers.entityArrayToEntityMap(entityArray)).toEqual({ '1': { id: '1' } })
  })

  it('fixedRound should work', () => {
    expect(reducers.fixedRound(1.23456)).toEqual(1.23)
  })
})
