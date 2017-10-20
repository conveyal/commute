import makeGenericModelActions from '../utils/actions'

const actions = makeGenericModelActions({
  commands: {
    'Collection DELETE': {},
    'Collection GET': {}
  },
  pluralName: 'polygons',
  singularName: 'polygon'
})

export default actions
