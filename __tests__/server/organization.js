/* globals afterAll, beforeAll, describe, expect, it */

import mongoose from 'mongoose'
import request from 'supertest-as-promised'

import app from '../../server/app'
import db from '../../server/db'
import {Organization} from '../../server/models'

import {parseServerResponse} from '../test-utils/server'

describe('organization', () => {
  beforeAll((done) => {
    // start with fresh db
    db.dropDatabase(done)
  })

  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  it('should find zero organizations in fresh state', () => {
    return request(app)
      .get('/api/organization')
      .then((res) => {
        const json = parseServerResponse(res)
        expect(json.length).toBe(0)
      })
  })

  it('should add organization', () => {
    return request(app)
      .post('/api/organization')
      .send({ name: 'test-org' })
      .then(async (res) => {
        const json = parseServerResponse(res)
        expect(json.name).toBe('test-org')
        const count = await Organization.count().exec()
        expect(count).toBe(1)
      })
  })

  let organizationId

  it('should find organization after it was added', () => {
    return request(app)
      .get('/api/organization')
      .then((res) => {
        const json = parseServerResponse(res)
        expect(json.length).toBe(1)
        expect(json[0].name).toBe('test-org')
        organizationId = json[0]._id
      })
  })

  it('should update organization', () => {
    const newName = 'New Organization Name'
    return request(app)
      .put(`/api/organization/${organizationId}`)
      .send({ name: newName })
      .then(async (res) => {
        parseServerResponse(res)
        const org = await Organization.findById(organizationId).exec()
        expect(org.name).toBe(newName)
      })
  })

  it('should delete organization', () => {
    return request(app)
      .delete(`/api/organization/${organizationId}`)
      .then(async (res) => {
        parseServerResponse(res)
        const count = await Organization.count().exec()
        expect(count).toBe(0)
      })
  })
})
