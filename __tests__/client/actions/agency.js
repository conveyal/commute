/* global describe, it */

import {expectCreateAction, expectDeleteAgency, expectUpdateAction} from '../../test-utils/actions'
import * as agency from '../../../client/actions/agency'

describe('actions > agency', () => {
  it('create agency should work', () => {
    const data = {
      name: 'mockAgency'
    }
    const actions = agency.createAgency(data)

    expectCreateAction(actions)
  })

  it('update agency should work', () => {
    const data = {
      id: 'agency-id',
      name: 'New name'
    }
    const actions = agency.updateAgency(data)

    expectUpdateAction(actions)
  })

  it('delete agency should work', () => {
    const result = agency.deleteAgency('1')

    expectDeleteAgency(result)
  })
})
