/* globals afterEach, beforeEach, describe, expect, it */

import request from 'supertest-as-promised'
import app from '../../server/app'

const parseServerResponse = (res) => {
  let json
  try {
    json = JSON.parse(res.text)
  } catch (e) {
    console.error('Unable to parse server response into JSON')
    console.log(res.text)
    throw e
  }
  expect(json.errors).toBeFalsy()
  expect(res.status).toBe(200)
  return json
}

const requireKeys = (obj, required) => {
  required.forEach((k) => {
    if (!obj[k]) {
      throw new Error(`${k} is required for this test`)
    }
  })
}

/**
 * Make a rest endpoint tests with the specified routes
 *
 * @param  {String} name     The endpoint name
 * @param  {Object} commands Keys representing commands to make and their corresponding options
 * @param  {Object} model    The mongo model to use
 */
export const makeRestEndpointTests = (name, commands, model) => {
  async function removeAll () {
    await model.remove({}).exec()
  }

  describe('rest endpoint', () => {
    beforeEach(removeAll)
    afterEach(removeAll)

    if (commands['Collection GET']) {
      it('should find zero models in fresh state', async () => {
        // make request
        const res = await request(app).get(`/api/${name}`)

        // handle response
        const json = parseServerResponse(res)
        expect(json.length).toBe(0)
      })
    }

    if (commands['Collection POST']) {
      const cfg = commands['Collection POST']
      const creationData = cfg.creationData || {}
      const customAssertions = cfg.customAssertions || (() => 'no-op')
      it('should add model', async () => {
        // make request
        const res = await request(app)
          .post(`/api/${name}`)
          .send(creationData)

        // handle response
        const json = parseServerResponse(res)
        expect(json.name).toBe('test-org')
        const count = await model.count().exec()
        expect(count).toBe(1)
        customAssertions(json, res)
      })
    }

    if (commands['DELETE']) {
      it('should delete model', async () => {
        const cfg = commands['DELETE']
        const initData = cfg.initData || {}

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

    if (commands['PUT']) {
      it('should update model', async () => {
        const cfg = commands['PUT']
        requireKeys(cfg, ['customAssertions', 'initData', 'updateData'])
        const {customAssertions, initData, updateData} = cfg

        // create model
        const createdModel = await model.create(initData)
        const modelId = createdModel._id

        // make request
        const res = await request(app).put(`/api/${name}/${modelId}`).send(updateData)

        // handle response
        const json = parseServerResponse(res)
        const data = await model.findById(modelId).exec()
        customAssertions(data, json, res)
      })
    }
  })
}
