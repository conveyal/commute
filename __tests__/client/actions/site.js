/* global describe, it */

import {expectCreateSite, expectDeleteSite, expectUpdateAction} from '../../test-utils/actions'
import * as site from '../../../client/actions/site'

describe('actions > site', () => {
  it('create site should work', () => {
    const data = {
      name: 'mockSite',
      organizationId: 'organization-id'
    }
    const actions = site.createSite(data)

    expectCreateSite(actions)
  })

  it('update site should work', () => {
    const data = {
      id: 'site-id',
      name: 'New Name',
      organizationId: 'organization-id'
    }
    const actions = site.updateSite(data)

    expectUpdateAction(actions)
  })

  it('delete site should work', () => {
    const result = site.deleteSite({ id: 'site-id', organizationId: 'organization-id' })

    expectDeleteSite(result)
  })
})
