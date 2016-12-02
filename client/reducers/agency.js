import {makeChildrenHandlers, makeGenericReducerHandlers} from '../utils/reducers'

export const reducers = makeGenericReducerHandlers({
  handlers: ['add', 'delete', 'set', 'set many'],
  name: {
    singular: 'agency',
    plural: 'agencies'
  }
})

Object.assign(reducers, makeChildrenHandlers({
  childPluralName: 'organizations',
  childSingularName: 'organization',
  parentIdField: 'agencyId'
}))

export const initialState = {}
