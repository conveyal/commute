/* global describe, expect, it */

import * as user from '../../../client/actions/user'

describe('actions > user', () => {
  it('login should work', () => {
    expect(user.login()).toMatchSnapshot()
  })

  it('logout should work', () => {
    expect(user.logout()).toMatchSnapshot()
  })
})
