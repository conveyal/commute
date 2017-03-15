/* global describe */

import {makeGenericModelActionsTests} from '../../test-utils/actions'

import * as polygon from '../../../client/actions/polygon'

describe('actions > polygon', () => {
  makeGenericModelActionsTests({
    actions: polygon,
    commands: {
      'Collection GET': {},
      'Collection DELETE': {
        args: { siteId: 'site-id' }
      }
    },
    pluralName: 'polygons',
    singularName: 'polygon'
  })
})
