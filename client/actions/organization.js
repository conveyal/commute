import makeGenericModelActions from '../utils/actions'

const actions = makeGenericModelActions({
  commands: {
    'Collection GET': {},
    'Collection POST': {},
    'DELETE': {},
    'GET': {},
    'PUT': {}
  },
  parentKey: 'agencyId',
  parentName: 'agency',
  pluralName: 'organizations',
  singularName: 'organization'
})

export default actions
