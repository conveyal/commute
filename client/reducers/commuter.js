import {addToEntityMap, makeGenericReducerHandlers} from '../utils/reducers'

export const reducers = makeGenericReducerHandlers({
  handlers: ['add', 'delete', 'set', 'set all'],
  name: {
    singular: 'commuter',
    plural: 'commuters'
  }
})

reducers['append commuters'] = function (state, action) {
  let updatedState = state
  action.payload.commuters.forEach((commuter) => {
    updatedState = addToEntityMap(updatedState, commuter)
  })
  return updatedState
}

export const initialState = {}
