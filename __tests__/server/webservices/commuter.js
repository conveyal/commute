/* globals afterAll, describe, expect */

import mongoose from 'mongoose'

import {Commuter} from '../../../server/models'

import {makeRestEndpointTests} from '../../test-utils/server'

describe('commuter', () => {
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  const initCommuterData = {
    address: '123 Main St',
    coordinate: {
      lat: 12,
      lon: 34
    },
    name: 'test-commuter',
    groupId: mongoose.Types.ObjectId()
  }

  makeRestEndpointTests({
    endpoints: {
      'Collection GET': {},
      'Collection POST': {
        creationData: initCommuterData,
        customAssertions: (json) => {
          expect(json[0].name).toBe('test-commuter')
        }
      },
      'DELETE': {
        initData: initCommuterData
      },
      'GET': {
        initData: initCommuterData
      },
      'PUT': {
        customAssertions: (modelData, json) => {
          expect(modelData.name).toBe('updated name')
          expect(json.name).toBe('updated name')
        },
        initData: initCommuterData,
        updateData: {
          name: 'updated name'
        }
      }
    },
    foreignKeys: ['groupId'],
    geocodePlugin: true,
    model: Commuter,
    name: 'commuter'
  })
})
