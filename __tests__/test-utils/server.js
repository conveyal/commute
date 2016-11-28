/* globals afterEach, beforeEach, describe, expect, it */

import omit from 'lodash.omit'
import nock from 'nock'
import request from 'supertest-as-promised'

import {requireKeys} from './common'

import app from '../../server/app'

export const parseServerResponse = (res) => {
  let json
  try {
    json = JSON.parse(res.text)
  } catch (e) {
    console.error('Unable to parse server response into JSON')
    console.error(res.text)
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
  .reply(200, JSON.stringify({
    'geocoding': {
      'version': '0.2',
      'attribution': 'https://search.mapzen.com/v1/attribution',
      'query': {
        'text': 'takoma',
        'size': 10,
        'sources': [
          'geonames',
          'openaddresses',
          'openstreetmap',
          'whosonfirst'
        ],
        'private': false,
        'boundary.circle.radius': 25,
        'boundary.circle.lat': 38.8886,
        'boundary.circle.lon': -77.043,
        'querySize': 20
      },
      'engine': {
        'name': 'Pelias',
        'author': 'Mapzen',
        'version': '1.0'
      },
      'timestamp': 1479272483487
    },
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [
            -77.023104,
            38.976745
          ]
        },
        'properties': {
          'id': '85851759',
          'gid': 'whosonfirst:neighbourhood:85851759',
          'layer': 'neighbourhood',
          'source': 'whosonfirst',
          'source_id': '85851759',
          'name': 'Takoma',
          'confidence': 0.965,
          'accuracy': 'centroid',
          'country': 'United States',
          'country_gid': 'whosonfirst:country:85633793',
          'country_a': 'USA',
          'region': 'Maryland',
          'region_gid': 'whosonfirst:region:85688501',
          'region_a': 'MD',
          'county': 'Montgomery County',
          'county_gid': 'whosonfirst:county:102082719',
          'locality': 'Takoma Park',
          'locality_gid': 'whosonfirst:locality:85949501',
          'neighbourhood': 'Takoma',
          'neighbourhood_gid': 'whosonfirst:neighbourhood:85851759',
          'label': 'Takoma, Takoma Park, MD, USA'
        },
        'bbox': [
          -77.017242,
          38.973896,
          -77.012062,
          38.980594
        ]
      }
    ],
    'bbox': [
      -77.017897,
      38.904,
      -76.978642,
      39.001084
    ]
  }))

export const makeRemoveModelsFn = (model) => async () => await model.remove({}).exec()

/**
 * Make a rest endpoint tests with the specified routes
 *
 * @param {Object} cfg   A configuration object with the following data:
 *   - {Object} endpoints    Keys representing endpoints to make and their corresponding options
 *   - {Array} foreignKeys   An array of strings representing foreign keys in the model
 *   - {bool} geocodePlugin  whether or not the model has a geocodePlugin
 *   - {Object} model        The mongo model to use
 *   - {String} name         The endpoint name
 *   - {Object} parentModel  An object describing a parent relationship in this model.
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
  const snapshotOmitions = ['_id'].concat(cfg.foreignKeys || [])
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
      const creationData = cfg.creationData || {}
      const customAssertions = cfg.customAssertions || (() => 'no-op')
      it('should add model', async () => {
        if (geocodePlugin) prepareGeocodeNock()

        // make request
        const res = await request(app)
          .post(`/api/${name}`)
          .send(creationData)

        // handle response
        const json = parseServerResponse(res)
        expect(omit(json, snapshotOmitions)).toMatchSnapshot()
        const count = await model.count().exec()
        expect(count).toBe(1)

        customAssertions(json, res)
      })
    }

    if (endpoints['DELETE']) {
      it('should delete model', async () => {
        const cfg = endpoints['DELETE']
        const initData = cfg.initData || {}
        if (geocodePlugin) prepareGeocodeNock()

        // create model
        const createdModel = await model.create(initData)
        const modelId = createdModel._id
        const customAssertions = cfg.customAssertions || (() => 'no-op')

        // make request
        const res = await request(app).delete(`/api/${name}/${modelId}`)

        // handle response
        const json = parseServerResponse(res)
        const count = await model.count().exec()
        expect(count).toBe(0)

        customAssertions(json, res)
      })
    }

    if (endpoints['GET']) {
      it('should get model', async () => {
        const cfg = endpoints['GET']
        requireKeys(cfg, ['initData'])
        const initData = cfg.initData
        if (geocodePlugin) prepareGeocodeNock()

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
        const {customAssertions, initData, updateData} = cfg
        if (geocodePlugin) prepareGeocodeNock()

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
