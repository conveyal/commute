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
  pluralName: 'multi-sites',
  singularName: 'multi-site'
})

export default actions
