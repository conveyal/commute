import makeGenericModelActions from '../utils/actions'

const actions = makeGenericModelActions({
  commands: {
    'Collection GET': {},
    'Collection POST': {},
    'DELETE': {
      redirectionStrategy: 'toHome'
    },
    'GET': {},
    'PUT': {}
  },
  pluralName: 'sites',
  singularName: 'site'
})

export default actions
