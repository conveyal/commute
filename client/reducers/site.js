import {
  getGenericReducerInitialState,
  makeChildrenHandlers,
  makeGenericReducerHandlers
} from '../utils/reducers'

export const reducers = makeGenericReducerHandlers({
  handlers: ['add', 'add many', 'delete', 'set', 'set many'],
  name: {
    singular: 'site',
    plural: 'sites'
  }
})

Object.assign(reducers, makeChildrenHandlers({
  childPluralName: 'commuters',
  childSingularName: 'commuter',
  parentIdField: 'siteId'
}))

export const initialState = getGenericReducerInitialState()
