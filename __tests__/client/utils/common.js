/* globals describe, expect, it */

import * as common from '../../../client/utils/common'

describe('utils > reducers', () => {
  it('fixedRound should work', () => {
    expect(common.fixedRound(1.23456)).toEqual(1.23)
  })
})
