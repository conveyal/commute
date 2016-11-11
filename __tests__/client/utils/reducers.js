/* globals describe, expect, it */

import * as reducers from '../../../client/utils/reducers'

describe('utils > reducers', () => {
  it('arrayToObj should work', () => {
    expect(reducers.arrayToObj([{id: '1'}])).toMatchSnapshot()
  })
})
