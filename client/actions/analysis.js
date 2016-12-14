import makeGenericModelActions from '../utils/actions'

const actions = makeGenericModelActions({
  commands: {
    'Collection GET': {},
    'Collection POST': {},
    'DELETE': {},
    'GET': {}
  },
  parentKey: 'organizationId',
  parentName: 'organization',
  pluralName: 'analyses',
  singularName: 'analysis'
})

export default actions
