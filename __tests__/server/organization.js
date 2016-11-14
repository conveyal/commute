/* globals afterAll, beforeAll, describe, expect, it */

import mongoose from 'mongoose'
import request from 'supertest-as-promised'

import app from '../../server/app'
import db from '../../server/db'
import {Organization} from '../../server/models'

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
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        query: `{
          organizations{
            name
          }
        }`
      }))
      .then((res) => {
        const json = JSON.parse(res.text)
        expect(json.errors).toBeFalsy()
        expect(json.data.organizations.length).toBe(0)
      })
  })

  it('should add organization', () => {
    return request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        query: `mutation Mutation {
          createOrganization(name: "test-org") {
            name
          }
        }`
      }))
      .then(async (res) => {
        const json = JSON.parse(res.text)
        expect(json.errors).toBeFalsy()
        expect(json).toMatchSnapshot()
        const count = await Organization.count().exec()
        expect(count).toBe(1)
      })
  })

  it('should find organization after it was added', () => {
    return request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        query: `{
          organizations{
            owner,
            name
          }
        }`
      }))
      .then((res) => {
        const json = JSON.parse(res.text)
        expect(json.errors).toBeFalsy()
        expect(json.data.organizations.length).toBe(1)
        expect(json.data.organizations[0].name).toBe('test-org')
      })
  })

  it('should update organization', () => {
    return request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        query: `mutation Mutation {
          updateOrganization(
            name: "test-org"
            newName: "New Organization Name"
          ) {
            name
          }
        }`
      }))
      .then(async (res) => {
        const json = JSON.parse(res.text)
        expect(json.errors).toBeFalsy()
        const org = await Organization.findOne({ name: 'New Organization Name' }).exec()
        expect(org.name).toBe('New Organization Name')
      })
  })

  it('should delete organization', () => {
    return request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({
        query: `mutation Mutation {
          deleteOrganization(
            name: "New Organization Name"
          ) {
            name
          }
        }`
      }))
      .then(async (res) => {
        const json = JSON.parse(res.text)
        expect(json.errors).toBeFalsy()
        const count = await Organization.count().exec()
        expect(count).toBe(0)
      })
  })
})
