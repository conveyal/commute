/* global describe, it */

import {expectCreateGroup, expectDeleteGroup} from '../../test-utils/actions'

import * as group from '../../../client/actions/group'

describe('actions > group', () => {
  it('create group should work', () => {
    const data = {
      name: 'Mock Group'
    }
    const result = group.createGroup(data, '1')

    expectCreateGroup(result)
  })

  it('delete group should work', () => {
    const result = group.deleteGroup('1', '1')

    expectDeleteGroup(result)
  })
})
