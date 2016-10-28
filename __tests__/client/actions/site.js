/* global describe, it */

import {expectCreateAction} from '../../test-utils/actions'

import * as site from '../../../client/actions/site'

describe('actions > site', () => {
  it('create site should work', () => {
    const fieldData = {
      name: 'mockSite',
      organizationId: '1'
    }
    const result = site.createSite(fieldData)

    expectCreateAction(result)
  })
})
