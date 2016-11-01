/* global describe, it */

import {expectCreateSite, expectDeleteSite, expectUpdateAction} from '../../test-utils/actions'
import * as site from '../../../client/actions/site'

describe('actions > site', () => {
  it('create site should work', () => {
    const data = {
      name: 'mockSite'
    }
    const actions = site.createSite(data, '1')

    expectCreateSite(actions)
  })

  it('update site should work', () => {
    const data = {
      name: 'mockSite'
    }
    const actions = site.updateSite(data, '1')

    expectUpdateAction(actions)
  })

  it('delete site should work', () => {
    const result = site.deleteSite('1', '1')

    expectDeleteSite(result)
  })
})
