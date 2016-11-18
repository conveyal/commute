/* global describe, it */

import {expectCreateSite, expectDeleteSite, expectUpdateAction} from '../../test-utils/actions'
import * as site from '../../../client/actions/site'

describe('actions > site', () => {
  it('create site should work', () => {
    const data = {
      name: 'mockSite'
    }
    const actions = site.createSite(data, 'organization-id')

    expectCreateSite(actions)
  })

  it('update site should work', () => {
    const data = {
      id: 'site-id',
      name: 'New Name'
    }
    const actions = site.updateSite('organization-id', data)

    expectUpdateAction(actions)
  })

  it('delete site should work', () => {
    const result = site.deleteSite('site-id', 'organization-id')

    expectDeleteSite(result)
  })
})
