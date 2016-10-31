/* global describe, it */

import {expectCreateSite, expectDeleteSite} from '../../test-utils/actions'
import * as site from '../../../client/actions/site'

describe('actions > site', () => {
  it('create site should work', () => {
    const data = {
      name: 'mockSite',
      organizationId: '1'
    }
    const actions = site.createSite(data)

    expectCreateSite(actions)
  })

  it('delete site should work', () => {
    const result = site.deleteSite('1', '1')

    expectDeleteSite(result)
  })
})
