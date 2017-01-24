import {makeChildrenHandlers, makeGenericReducerHandlers} from '../utils/reducers'

export const reducers = makeGenericReducerHandlers({
  handlers: ['add', 'delete', 'set', 'set many'],
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

export const initialState = {}
