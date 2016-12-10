/* globals afterAll, describe, expect */

import mongoose from 'mongoose'

import {Site} from '../../../server/models'

import {makeRestEndpointTests} from '../../test-utils/server'

describe('site', () => {
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  const initSiteData = {
    address: '123 Main St',
    coordinate: {
      lat: 12,
      lng: 34
    },
    name: 'test-site',
    organizationId: mongoose.Types.ObjectId()
  }

  makeRestEndpointTests({
    endpoints: {
      'Collection GET': {},
      'Collection POST': {
        creationData: initSiteData,
        customAssertions: (json) => {
          expect(json[0].name).toBe('test-site')
        }
      },
      'DELETE': {
        initData: initSiteData
      },
      'GET': {
        initData: initSiteData
      },
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
    foreignKeys: ['organizationId'],
    geocodePlugin: true,
    model: Site,
    name: 'site'
  })
})
