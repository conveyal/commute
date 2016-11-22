import {makeChildrenHandlers, makeGenericReducerHandlers} from '../utils/reducers'

export const reducers = makeGenericReducerHandlers({
  handlers: ['add', 'delete', 'set', 'set all'],
  name: {
    singular: 'organization',
    plural: 'organizations'
  }
})

Object.assign(reducers, makeChildrenHandlers({
  childPluralName: 'analyses',
  childSingularName: 'analysis',
  parentIdField: 'organizationId'
}))

Object.assign(reducers, makeChildrenHandlers({
  childPluralName: 'groups',
  childSingularName: 'group',
  parentIdField: 'organizationId'
}))

Object.assign(reducers, makeChildrenHandlers({
  childPluralName: 'sites',
  childSingularName: 'site',
  parentIdField: 'organizationId'
}))

export const initialState = {}
