/* globals afterAll, describe, expect */

import mongoose from 'mongoose'

import {Organization} from '../../server/models'

import {makeRestEndpointTests} from '../test-utils/server'

describe('organization', () => {
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  makeRestEndpointTests('organization',
    {
      'Collection GET': {},
      'Collection POST': {
        creationData: {
          name: 'test-org'
        },
        customAssertions: (json) => {
          expect(json.name).toBe('test-org')
        }
      },
      'DELETE': {},
      'PUT': {
        initData: {
          name: 'test-org'
        },
        updateData: {
          name: 'updated name'
        },
        customAssertions: (modelData, json) => {
          expect(modelData.name).toBe('updated name')
          expect(json.name).toBe('updated name')
        }
      }
    },
    Organization
  )
})
