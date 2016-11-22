/* global describe, it */

import {expectCreateAnalysis, expectDeleteAnalysis} from '../../test-utils/actions'

import * as analysis from '../../../client/actions/analysis'
import {mockCommuter} from '../../test-utils/mock-data'

describe('actions > analysis', () => {
  it('create analysis should work', () => {
    const data = {
      commuters: [mockCommuter],
      groupId: 'group-id',
      name: 'Mock Analysis',
      organizationId: 'organization-id',
      siteId: 'site-id'
    }
    const result = analysis.createAnalysis(data)

    expectCreateAnalysis(result)
  })

  it('delete analysis should work', () => {
    const result = analysis.deleteAnalysis({ id: 'site-id', organizationId: 'organization-id' })

    expectDeleteAnalysis(result)
  })
})
