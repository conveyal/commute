/* global describe, expect, it */

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

  it('loadAgencies should work', () => {
    const action = agency.loadAgencies()
    expect(action.type).toBe('fetch')
    const nextAction = action.payload.next([])
    expect(nextAction.type).toBe('set agencies')
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
