/* globals afterAll, describe, expect */

import mongoose from 'mongoose'

import {MultiSite} from '../../../server/models'

import {makeRestEndpointTests} from '../../test-utils/server'

describe('multi-site', () => {
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  const initMultiSiteData = {
    name: 'test-multi-site'
  }

  makeRestEndpointTests({
    endpoints: {
      'Collection GET': {},
      'Collection POST': {
        creationData: initMultiSiteData,
        customAssertions: (json) => {
          expect(json[0].name).toBe('test-multi-site')
        }
      },
      'DELETE': {
        initData: initMultiSiteData
      },
      'GET': {
        initData: initMultiSiteData
      },
      'PUT': {
        initData: initMultiSiteData,
        updateData: {
          name: 'updated name'
        },
        customAssertions: (modelData, json) => {
          expect(modelData.name).toBe('updated name')
          expect(json.name).toBe('updated name')
        }
      }
    },
    model: MultiSite,
    name: 'multi-site'
  })
})
