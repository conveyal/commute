/* global describe, expect, it */

import * as map from '../../../client/actions/user'

describe('actions > user', () => {
  it('login should work', () => {
    expect(map.login()).toMatchSnapshot()
  })

  it('logout should work', () => {
    expect(map.logout()).toMatchSnapshot()
  })
})
