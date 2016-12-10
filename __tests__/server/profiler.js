/* globals afterAll, afterEach, describe, expect, it */

import mongoose from 'mongoose'

import {timeoutPromise} from '../test-utils/common'
import {mockCommuter, mockSite} from '../test-utils/mock-data'
import {makeRemoveModelsFn, prepareOtpNock} from '../test-utils/server'

import {Analysis, Trip} from '../../server/models'
import profiler from '../../server/utils/profiler'

describe('profiler', () => {
  afterEach(makeRemoveModelsFn(Analysis))
  afterAll(() => {
    mongoose.disconnect() // disconnect from mongo to end running of tests
  })

  it('should profile commuters', async () => {
    prepareOtpNock()

    // prepare commuter record
    const fakeCommuterId = mongoose.Types.ObjectId()
    const madeUpCommuter = Object.assign(mockCommuter, { _id: fakeCommuterId })

    // prepare analysis record
    const analysis = await Analysis.create({
      calculationStatus: 'skipCalculation',
      groupId: mongoose.Types.ObjectId(),
      name: 'An Analysis',
      organizationId: mongoose.Types.ObjectId(),
      siteId: mongoose.Types.ObjectId()
    })

    // profile some mock commuters
    profiler({ analysisId: analysis._id, commuters: [madeUpCommuter], site: mockSite })

    // wait a little bit
    await timeoutPromise(2000)

    // expect summary stats to be calculated in analysis
    const allAnalyses = await Analysis.find().exec()
    const modifiedAnalysis = allAnalyses[0]

    expect(modifiedAnalysis.summary.avgTravelTime).toEqual(681)

    // expect new trip to be saved
    const allTrips = await Trip.find().exec()
    const insertedTrip = allTrips[0]

    expect(insertedTrip.mostLikely.mode).toEqual('bike')
  })
})
