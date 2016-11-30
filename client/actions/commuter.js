import makeGenericModelActions from '../utils/actions'

const actions = makeGenericModelActions({
  commands: {
    'Collection GET': {},
    'Collection POST': {
      redirectionStrategy: 'toParent'
    },
    'DELETE': {},
    'GET': {},
    'PUT': {
      redirectionStrategy: 'toParent'
    }
  },
  parentKey: 'groupId',
  parentName: 'group',
  pluralName: 'commuters',
  singularName: 'commuter'
})

export default actions
