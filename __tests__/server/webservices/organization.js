/* globals afterAll, describe, expect */

import mongoose from 'mongoose'

import {Organization} from '../../../server/models'

import {makeRestEndpointTests} from '../../test-utils/server'

describe('organization', () => {
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  const initOrganizationData = {
    agencyId: mongoose.Types.ObjectId(),
    name: 'test-org'
  }

  makeRestEndpointTests({
    endpoints: {
      'Collection GET': {},
      'Collection POST': {
        creationData: initOrganizationData,
        customAssertions: (json) => {
          expect(json[0].name).toBe('test-org')
        }
      },
      'DELETE': {
        initData: initOrganizationData
      },
      'GET': {
        initData: initOrganizationData
      },
      'PUT': {
        initData: initOrganizationData,
        updateData: {
          name: 'updated name'
        },
        customAssertions: (modelData, json) => {
          expect(modelData.name).toBe('updated name')
          expect(json.name).toBe('updated name')
        }
      }
    },
    foreignKeys: ['agencyId'],
    model: Organization,
    name: 'organization'
  })
})
