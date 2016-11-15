/* globals afterAll, describe, expect */

import mongoose from 'mongoose'

import {Site} from '../../server/models'

import {makeRestEndpointTests} from '../test-utils/server'

describe('site', () => {
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  const initSiteData = {
    address: '123 Main St',
    location: {
      lat: 12,
      lon: 34
    },
    name: 'test-site'
  }

  makeRestEndpointTests('site',
    {
      'Collection GET': {},
      'Collection POST': {
        creationData: initSiteData,
        customAssertions: (json) => {
          expect(json.name).toBe('test-site')
        }
      },
      'DELETE': {},
      'PUT': {
        initData: initSiteData,
        updateData: {
          name: 'updated name'
        },
        customAssertions: (modelData, json) => {
          expect(modelData.name).toBe('updated name')
          expect(json.name).toBe('updated name')
        }
      }
    },
    Site
  )
})
