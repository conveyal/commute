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

    // prepare analysis record
    const analysis = await Analysis.create({
      calculationStatus: 'skipCalculation',
      groupId: mongoose.Types.ObjectId(),
      name: 'An Analysis',
      organizationId: mongoose.Types.ObjectId(),
      siteId: mongoose.Types.ObjectId()
    })

    // profile some mock commuters
    profiler({ analysisId: analysis._id, commuters: [mockCommuter], site: mockSite })

    // wait a little bit
    await timeoutPromise(200)

    // expect summary stats to be calculated in analysis
    const modifiedAnalysis = await Analysis.find().exec()

    expect(modifiedAnalysis.summary.avgTravelTime).toEqual(1)

    // expect new trip to be saved
    const insertedTrip = await Trip.find().exec()

    expect(insertedTrip).toEqual()
  })
})
