import makeGenericModelActions from '../utils/actions'

const actions = makeGenericModelActions({
  commands: {
    'Collection GET': {},
    'Collection POST': {},
    'DELETE': {},
    'GET': {},
    'PUT': {}
  },
  parentKey: 'organizationId',
  parentName: 'organization',
  pluralName: 'groups',
  singularName: 'group'
})

export default actions
