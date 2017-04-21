/* globals afterAll, afterEach, beforeEach, describe, expect, it */

import mongoose from 'mongoose'

import {timeoutPromise} from '../test-utils/common'
import {makeRemoveModelsFn, prepareIsochroneNock} from '../test-utils/server'

import models from '../../server/models'

function cleanData () {
  return Promise.all([makeRemoveModelsFn(models.Site), makeRemoveModelsFn(models.Commuter)])
}

describe('isochrone utils', () => {
  beforeEach(cleanData)
  afterEach(cleanData)
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  it('should calculate site isochrones and commuter stats from site data', async () => {
    prepareIsochroneNock()

    // create site
    await models.Site.create({
      address: '123 main st',
      coordinate: {
        lat: 12,
        lon: 34
      },
      name: 'Mock Site',
      user: 'test-user'
    })

    // verify existence of isochrones
    // wait a little bit and then fetch site and polygons
    await timeoutPromise(1000)

    // expect site to have calculationStatus set to success
    const testSite = await models.Site.findOne().exec()
    expect(testSite.calculationStatus).toBe('successfully')

    // expect polygons to have been created
    const testPolygons = await models.Polygon.find({ siteId: testSite._id })
    expect(testPolygons.length).toBeGreaterThan(0)

    // add commuter to site
    await models.Commuter.create({
      address: '123 main st',
      coordinate: {
        lat: 12,
        lon: 34
      },
      name: 'Mock Commuter',
      siteId: testSite._id,
      user: 'test-user'
    })

    // verify commuter has travel time stats
    // wait a little bit and then refetch model
    await timeoutPromise(1000)
    const createdCommuter = await models.Commuter.findOne().exec()
    expect(createdCommuter.modeStats).toBeTruthy()
  })
})
