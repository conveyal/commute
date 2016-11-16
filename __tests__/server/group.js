/* globals beforeEach, afterAll, afterEach, describe, expect, it */

import mongoose from 'mongoose'
import request from 'supertest-as-promised'

import app from '../../server/app'
import {Commuter, Group} from '../../server/models'

import {makeRestEndpointTests, parseServerResponse, prepareGeocodeNock} from '../test-utils/server'

describe('group', () => {
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  const initGroupData = {
    name: 'test-group',
    organization: mongoose.Types.ObjectId()
  }

  makeRestEndpointTests('group',
    {
      'Collection GET': {},
      'Collection POST': {
        creationData: initGroupData
      },
      'GET': {
        initData: initGroupData
      },
      'DELETE': {
        initData: initGroupData
      },
      'PUT': {
        initData: initGroupData,
        updateData: {
          name: 'updated name'
        },
        customAssertions: (modelData, json) => {
          expect(modelData.name).toBe('updated name')
          expect(json.name).toBe('updated name')
        }
      }
    },
    Group
  )

  describe('rest-ish endpoints', () => {
    const removeFn = async () => {
      await Commuter.remove({}).exec()
      await Group.remove({}).exec()
    }

    beforeEach(removeFn)
    afterEach(removeFn)

    it('should process Collection POST request', async () => {
      prepareGeocodeNock()

      // make request
      const res = await request(app)
        .post(`/api/group`)
        .send({
          commuters: [{
            address: '123 Abc Street',
            name: 'test commuter'
          }],
          name: 'test group',
          organization: mongoose.Types.ObjectId()
        })

      // handle response
      const json = parseServerResponse(res)
      const groupCount = await Group.count().exec()
      expect(groupCount).toBe(1)
      const commuterCount = await Commuter.count().exec()
      expect(commuterCount).toBe(1)
      expect(json.name).toBe('test group')
      const commuters = await Commuter.find().exec()
      expect(`${commuters[0].group}`).toBe(json._id)
    })
  })
})
