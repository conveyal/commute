/* globals afterAll, describe, expect */

import mongoose from 'mongoose'

import {Analysis} from '../../server/models'

import {makeRestEndpointTests} from '../test-utils/server'

describe('analysis', () => {
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  const initAnalysisData = {
    groupId: mongoose.Types.ObjectId(),
    name: 'test-analysis',
    organizationId: mongoose.Types.ObjectId(),
    siteId: mongoose.Types.ObjectId()
  }

  makeRestEndpointTests({
    endpoints: {
      'Collection GET': {},
      'Collection POST': {
        creationData: initAnalysisData,
        customAssertions: (json) => {
          expect(json.name).toBe('test-analysis')
        }
      },
      'DELETE': {
        initData: initAnalysisData
      },
      'GET': {
        initData: initAnalysisData
      }
    },
    foreignKeys: ['groupId', 'organizationId', 'siteId'],
    model: Analysis,
    name: 'analysis'
  })
})
