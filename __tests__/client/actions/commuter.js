/* global describe, it */

import {expectCreateCommuter, expectDeleteCommuter, expectUpdateAction} from '../../test-utils/actions'
import * as commuter from '../../../client/actions/commuter'

describe('actions > commuter', () => {
  it('create commuter should work', () => {
    const data = {
      name: 'mockCommuter'
    }
    const actions = commuter.createCommuter(data, 'group-id')

    expectCreateCommuter(actions)
  })

  it('update commuter should work', () => {
    const data = {
      id: 'commuter-id',
      name: 'mockCommuter'
    }
    const actions = commuter.updateCommuter(data)

    expectUpdateAction(actions)
  })

  it('delete commuter should work', () => {
    const result = commuter.deleteCommuter('commuter-id', 'group-id')

    expectDeleteCommuter(result)
  })
})
