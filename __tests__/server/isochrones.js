/* globals afterAll, afterEach, beforeEach, describe, expect, it */

const mongoose = require('mongoose')

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
      name: 'Mock Site'
    })

    // verify existence of isochrones
    // wait a little bit and then refetch model
    await timeoutPromise(1000)
    const testSite = await models.Site.findOne().exec()
    expect(testSite.travelTimeIsochrones).toBeTruthy()

    // add commuter to site
    await models.Commuter.create({
      address: '123 main st',
      coordinate: {
        lat: 12,
        lon: 34
      },
      name: 'Mock Commuter',
      siteId: testSite._id
    })

    // verify commuter has travel time stats
    // wait a little bit and then refetch model
    await timeoutPromise(1000)
    const createdCommuter = await models.Commuter.findOne().exec()
    expect(createdCommuter.modeStats).toBeTruthy()
  })
})
