import update from 'react-addons-update'

import {addToEntityMap, entityArrayToEntityIdArray} from '../utils/entities'
import {makeChildrenHandlers, makeGenericReducerHandlers} from '../utils/reducers'

export const reducers = makeGenericReducerHandlers({
  handlers: ['delete', 'set', 'set many'],
  name: {
    singular: 'group',
    plural: 'groups'
  }
})

reducers['add group'] = function (state, action) {
  const newGroup = {...action.payload}
  newGroup.commuters = newGroup.commuters.map((commuter) => commuter._id)
  return addToEntityMap(state, newGroup)
}

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
