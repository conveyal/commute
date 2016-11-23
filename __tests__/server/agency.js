/* globals afterAll, describe, expect */

import mongoose from 'mongoose'

import {Agency} from '../../server/models'

import {makeRestEndpointTests} from '../test-utils/server'

describe('agency', () => {
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  const initAgencyData = {
    name: 'test-agency'
  }

  makeRestEndpointTests('agency',
    {
      'Collection GET': {},
      'Collection POST': {
        creationData: initAgencyData,
        customAssertions: (json) => {
          expect(json.name).toBe('test-agency')
        }
      },
      'DELETE': {
        initData: initAgencyData
      },
      'GET': {
        initData: initAgencyData
      },
      'PUT': {
        initData: initAgencyData,
        updateData: {
          name: 'updated name'
        },
        customAssertions: (modelData, json) => {
          expect(modelData.name).toBe('updated name')
          expect(json.name).toBe('updated name')
        }
      }
    },
    Agency
  )
})
