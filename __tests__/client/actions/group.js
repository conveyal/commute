/* global describe, it */

import {expectCreateAction, expectDeleteGroup, expectUpdateGroup} from '../../test-utils/actions'

import * as group from '../../../client/actions/group'

describe('actions > group', () => {
  it('create group should work', () => {
    const data = {
      name: 'Mock Group'
    }
    const result = group.createGroup(data, 'organization-id')

    expectCreateAction(result)
  })

  it('delete group should work', () => {
    const result = group.deleteGroup('group-id', 'organization-id')

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
