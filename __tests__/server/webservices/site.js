/* globals afterAll, describe, expect */

import mongoose from 'mongoose'

import {Site} from '../../../server/models'

import {makeRestEndpointTests, prepareIsochroneNock} from '../../test-utils/server'

describe('site', () => {
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  const creationData = () => {
    prepareIsochroneNock()

    return new Promise((resolve, reject) => {
      resolve({
        address: '123 Main St',
        coordinate: {
          lat: 12,
          lon: 34
        },
        name: 'test-site',
        organizationId: mongoose.Types.ObjectId()
      })
    })
  }

  makeRestEndpointTests({
    endpoints: {
      'Collection GET': {},
      'Collection POST': {
        creationData: creationData,
        customAssertions: (json) => {
          expect(json[0].name).toBe('test-site')
        }
      },
      'DELETE': {
        initData: creationData
      },
      'GET': {
        initData: creationData
      },
      'PUT': {
        initData: creationData,
        updateData: {
          name: 'updated name'
        },
        customAssertions: (modelData, json) => {
          expect(modelData.name).toBe('updated name')
          expect(json.name).toBe('updated name')
        }
      }
    },
    snapshotOmitions: ['organizationId', 'travelTimeIsochrones'],
    geocodePlugin: true,
    model: Site,
    name: 'site'
  })
})
