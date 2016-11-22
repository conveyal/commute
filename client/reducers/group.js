import update from 'react-addons-update'

import {addToEntityMap, entityArrayToEntityIdArray} from '../utils/entities'
import {makeChildrenHandlers, makeGenericReducerHandlers} from '../utils/reducers'

export const reducers = makeGenericReducerHandlers({
  handlers: ['add', 'delete', 'set', 'set all'],
  name: {
    singular: 'group',
    plural: 'groups'
  }
})

reducers['append commuters'] = function (state, action) {
  const affectedGroup = state[action.payload.groupId]
  const modifiedGroup = update(affectedGroup, {
    commuters: {
      $push: entityArrayToEntityIdArray(action.payload.commuters)
    }
  })
  return addToEntityMap(state, modifiedGroup)
}

Object.assign(reducers, makeChildrenHandlers({
  childPluralName: 'commuters',
  childSingularName: 'commuter',
  parentIdField: 'groupId'
}))

export const initialState = {}
