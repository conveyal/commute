/* globals afterAll, describe, expect */

import mongoose from 'mongoose'

import {Commuter, Site} from '../../../server/models'

import {makeRestEndpointTests, prepareIsochroneNock} from '../../test-utils/server'

describe('commuter', () => {
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  const makeDependentData = () => {
    prepareIsochroneNock()

    // create site
    return Site.create({
      address: '123 main st',
      coordinate: {
        lat: 12,
        lon: 34
      },
      name: 'Mock Site',
      user: 'test-user'
    })
      .then((newSite) => {
        return [{
          address: '123 Main St',
          coordinate: {
            lat: 12,
            lon: 34
          },
          name: 'test-commuter',
          siteId: newSite._id,
          user: 'test-user'
        }]
      })
  }

  makeRestEndpointTests({
    endpoints: {
      'Collection GET': {},
      'Collection POST': {
        creationData: makeDependentData,
        customAssertions: (json) => {
          expect(json[0].name).toBe('test-commuter')
        }
      },
      'DELETE': {
        initData: makeDependentData
      },
      'GET': {
        initData: makeDependentData
      },
      'PUT': {
        customAssertions: (modelData, json) => {
          expect(modelData.name).toBe('updated name')
          expect(json.name).toBe('updated name')
        },
        initData: makeDependentData,
        updateData: {
          name: 'updated name'
        }
      }
    },
    snapshotOmitions: ['siteId', 'modeStats'],
    geocodePlugin: true,
    model: Commuter,
    name: 'commuter'
  })
})
