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
  pluralName: 'agencies',
  singularName: 'agency'
})

export default actions
