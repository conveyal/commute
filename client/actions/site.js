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
  parentKey: 'organizationId',
  parentName: 'organization',
  pluralName: 'sites',
  singularName: 'site'
})

export default actions
