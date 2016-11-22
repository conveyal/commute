import {addToEntityMap} from '../utils/entities'
import {makeGenericReducerHandlers} from '../utils/reducers'

export const reducers = makeGenericReducerHandlers({
  handlers: ['add', 'delete', 'set', 'set all'],
  name: {
    singular: 'commuter',
    plural: 'commuters'
  }
})

reducers['add group'] = function (state, action) {
  const newGroup = {...action.payload}
  let updatedState = {...state}
  newGroup.commuters.map((commuter) => {
    updatedState = addToEntityMap(updatedState, commuter)
  })
  return updatedState
}

reducers['append commuters'] = function (state, action) {
  let updatedState = state
  action.payload.commuters.forEach((commuter) => {
    updatedState = addToEntityMap(updatedState, commuter)
  })
  return updatedState
}

export const initialState = {}
