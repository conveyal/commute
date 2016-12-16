/* globals afterAll, describe, expect */

import mongoose from 'mongoose'

import {Analysis, Commuter, Group, Site} from '../../../server/models'

import {makeRestEndpointTests, prepareOtpNock} from '../../test-utils/server'

describe('analysis', () => {
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  const makeDependentData = () => {
    // create nock for trip planning
    prepareOtpNock()

    const organizationId = mongoose.Types.ObjectId()
    return Promise.all([
      Group.create({ name: 'Mock Group', organizationId })
        .then(async (group) => {
          return [group, await Commuter.create({ groupId: group._id, name: 'Mock commuter' })]
        }),
      Site.create({ name: 'Mock Site', organizationId })
    ])
      .then((results) => {
        return {
          groupId: results[0][0]._id,
          name: 'test-analysis',
          organizationId: organizationId,
          siteId: results[1]._id
        }
      })
  }

  makeRestEndpointTests({
    endpoints: {
      'Collection GET': {},
      'Collection POST': {
        creationData: makeDependentData,
        customAssertions: (json) => {
          expect(json[0].name).toBe('test-analysis')
        }
      },
      'DELETE': {
        initData: makeDependentData
      },
      'GET': {
        initData: makeDependentData
      }
    },
    // omit trips also because it is calculated after saving and
    // can appear depending on how fast calculation happens
    snapshotOmitions: ['groupId', 'organizationId', 'siteId', 'trips'],
    model: Analysis,
    name: 'analysis'
  })
})
