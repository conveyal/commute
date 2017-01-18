/* globals afterEach, beforeEach, describe, expect, it */

import omit from 'lodash.omit'
import nock from 'nock'
import request from 'supertest-as-promised'

import {requireKeys, timeoutPromise} from './common'
const mockGeocodeResult = require('./mock-geocode-result.json')
const mockTripPlanResult = require('./mock-trip-plan-result.json')

import app from '../../server/app'

export const parseServerResponse = (res) => {
  let json
  try {
    json = JSON.parse(res.text)
  } catch (e) {
    console.error('Unable to parse server response into JSON')
    console.error(`response text: "${res.text}"`)
    throw e
  }
  try {
    expect(json.error).toBeFalsy()
  } catch (err) {
    console.error(json.error)
    throw err
  }
  expect(res.status).toBe(200)
  return json
}

export const prepareGeocodeNock = () => nock(
  'https://search.mapzen.com/'
)
  .get(/v1\/search/)
  .reply(200, mockGeocodeResult)

export const prepareOtpNock = () => nock(
  'http://mock-otp.com/'
)
  .get(/api\/otp/)
  .reply(200, mockTripPlanResult)

export const makeRemoveModelsFn = (model) => async () => await model.remove({}).exec()

/**
 * Make a rest endpoint tests with the specified routes
 *
 * @param {Object} cfg   A configuration object with the following data:
 *   - {Object} endpoints       Keys representing endpoints to make and their corresponding options
 *   - {Array} snapshotOmitions An array of strings representing foreign keys in the model
 *   - {bool} geocodePlugin     whether or not the model has a geocodePlugin
 *   - {Object} model           The mongo model to use
 *   - {String} name            The endpoint name
 *   - {Object} parentModel     An object describing a parent relationship in this model.
 *     Has the following keys
 *     - {String} childrenField  children field in the paret model
 *     - {String} foreignKey     foreign key field name
 *     - {Object} model          parent model
 */
export const makeRestEndpointTests = (cfg) => {
  const endpoints = cfg.endpoints
  const geocodePlugin = cfg.geocodePlugin
  const model = cfg.model
  const name = cfg.name
  const snapshotOmitions = ['_id'].concat(cfg.snapshotOmitions || [])
  if (geocodePlugin) {
    snapshotOmitions.push('positionLastUpdated')
  }
  describe('rest endpoint', () => {
    beforeEach(makeRemoveModelsFn(model))
    afterEach(makeRemoveModelsFn(model))

    if (endpoints['Collection GET']) {
      it('should find zero models in fresh state', async () => {
        // make request
        const res = await request(app).get(`/api/${name}`)

        // handle response
        const json = parseServerResponse(res)
        expect(json.length).toBe(0)
      })
    }

    if (endpoints['Collection POST']) {
      const cfg = endpoints['Collection POST']
      let creationData = cfg.creationData || {}
      const customAssertions = cfg.customAssertions || (() => 'no-op')
      it('should add model', async () => {
        if (geocodePlugin) prepareGeocodeNock()

        if (typeof creationData === 'function') {
          // assume that the function returns a Promise
          creationData = await creationData()
        }

        // make request
        const res = await request(app)
          .post(`/api/${name}`)
          .send(creationData)

        // handle response
        const json = parseServerResponse(res)
        const entitiesToSnapshot = json.map((entity) => omit(entity, snapshotOmitions))
        expect(entitiesToSnapshot).toMatchSnapshot()
        const count = await model.count().exec()
        expect(count).toBe(1)

        customAssertions(json, res)
      })
    }

    if (endpoints['DELETE']) {
      it('should delete model', async () => {
        const cfg = endpoints['DELETE']
        let initData = cfg.initData || {}
        if (geocodePlugin) prepareGeocodeNock()

        if (typeof initData === 'function') {
          // assume that the function returns a Promise
          initData = await initData()
        }

        // create model
        const createdModel = await model.create(initData)
        const modelId = createdModel._id
        const customAssertions = cfg.customAssertions || (() => 'no-op')

        // make request
        const res = await request(app).delete(`/api/${name}/${modelId}`)

        // handle response
        const json = parseServerResponse(res)
        expect(json.trashed).toBeTruthy()

        // wait for mongo to save data???
        await timeoutPromise(1000)

        const entity = await model.findById(modelId).exec()
        expect(entity.trashed).toBeTruthy()

        customAssertions(json, res)
      })
    }

    if (endpoints['GET']) {
      it('should get model', async () => {
        const cfg = endpoints['GET']
        requireKeys(cfg, ['initData'])
        let initData = cfg.initData
        if (geocodePlugin) prepareGeocodeNock()

        if (typeof initData === 'function') {
          // assume that the function returns a Promise
          initData = await initData()
        }

        // create model
        const createdModel = await model.create(initData)
        const modelId = createdModel._id
        const customAssertions = cfg.customAssertions || (() => 'no-op')

        // make request
        const res = await request(app).get(`/api/${name}/${modelId}`)

        // handle response
        const json = parseServerResponse(res)
        expect(omit(json, snapshotOmitions)).toMatchSnapshot()
        expect(json._id).toEqual(`${modelId}`)
        customAssertions(json, res)
      })
    }

    if (endpoints['PUT']) {
      it('should update model', async () => {
        const cfg = endpoints['PUT']
        requireKeys(cfg, ['customAssertions', 'initData', 'updateData'])
        const {customAssertions, updateData} = cfg
        let {initData} = cfg
        if (geocodePlugin) prepareGeocodeNock()

        if (typeof initData === 'function') {
          // assume that the function returns a Promise
          initData = await initData()
        }

        // create model
        const createdModel = await model.create(initData)
        const modelId = createdModel._id

        // make request
        const res = await request(app).put(`/api/${name}/${modelId}`).send(updateData)

        // handle response
        const json = parseServerResponse(res)
        expect(omit(json, snapshotOmitions)).toMatchSnapshot()
        const data = await model.findById(modelId).exec()
        customAssertions(data, json, res)
      })
    }
  })
}
