/* globals describe */

import {mockPolygon, mockStores} from '../../test-utils/mock-data'
import {makeGenericReducerTestCases} from '../../test-utils/reducers'

import * as polygon from '../../../client/reducers/polygon'

describe('client > reducers > polygon', () => {
  makeGenericReducerTestCases({
    handlers: {
      'delete many': {
        initialState: mockStores.withSite.polygon,
        payload: { siteId: 'site-2' }
      },
      'set many': {
        initialState: polygon.initialState,
        payload: [mockPolygon]
      }
    },
    initialState: polygon.initialState,
    name: {
      plural: 'polygons',
      singular: 'polygon'
    },
    reducers: polygon.reducers
  })
})
