/* global describe, expect, it */

import * as user from '../../../client/actions/user'

describe('actions > user', () => {
  it('logout should work', () => {
    window.localStorage = {
      removeItem: () => {}
    }
    expect(user.logout()).toMatchSnapshot()
  })
})
