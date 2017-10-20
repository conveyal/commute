import {addToEntityMap} from '../utils/entities'
import {
  getGenericReducerInitialState,
  makeGenericReducerHandlers,
  updateTime
} from '../utils/reducers'

export const reducers = makeGenericReducerHandlers({
  handlers: ['add', 'add many', 'delete', 'set', 'set many'],
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
  return updateTime(updatedState)
}

reducers['append commuters'] = function (state, action) {
  let updatedState = state
  action.payload.commuters.forEach((commuter) => {
    updatedState = addToEntityMap(updatedState, commuter)
  })
  return updateTime(updatedState)
}

export const initialState = getGenericReducerInitialState()
