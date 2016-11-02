/* global describe, it */

import {expectCreateAnalysis, expectDeleteAnalysis} from '../../test-utils/actions'

import * as analysis from '../../../client/actions/analysis'

describe('actions > analysis', () => {
  it('create analysis should work', () => {
    const data = {
      groupId: '1',
      name: 'Mock Analysis',
      siteId: '1'
    }
    const result = analysis.createAnalysis(data, '1')

    expectCreateAnalysis(result)
  })

  it('delete analysis should work', () => {
    const result = analysis.deleteAnalysis('1', '1')

    expectDeleteAnalysis(result)
  })
})
