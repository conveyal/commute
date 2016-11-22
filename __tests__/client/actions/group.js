/* global describe, it */

import {expectCreateAction, expectDeleteGroup, expectUpdateGroup} from '../../test-utils/actions'

import * as group from '../../../client/actions/group'

describe('actions > group', () => {
  it('create group should work', () => {
    const data = {
      name: 'Mock Group',
      organizationId: 'organization-id'
    }
    const result = group.createGroup(data)

    expectCreateAction(result)
  })

  it('delete group should work', () => {
    const result = group.deleteGroup({ id: 'group-id', organizationId: 'organization-id' })

    expectDeleteGroup(result)
  })

  it('update group should work', () => {
    const data = {
      id: 'group-id',
      name: 'New Name'
    }
    const actions = group.updateGroup(data)

    expectUpdateGroup(actions)
  })
})
