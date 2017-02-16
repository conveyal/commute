/* globals describe, expect, it */

import * as util from '../../../client/utils'

describe('utils', () => {
  it('fixedRound should work', () => {
    expect(util.fixedRound(1.23456)).toEqual(1.23)
  })

  it('humanizeDistance should work', () => {
    expect(util.humanizeDistance(123)).toMatchSnapshot()
  })

  describe('> calcNumLessThan', () => {
    const testCases = [{
      arr: [],
      target: 3,
      expected: 0
    }, {
      arr: [1],
      target: 3,
      expected: 1
    }, {
      arr: [4],
      target: 3,
      expected: 0
    }, {
      arr: [1, 2, 3, 4],
      target: 0,
      expected: 0
    }, {
      arr: [1, 2, 3, 4],
      target: 5,
      expected: 4
    }, {
      arr: [1, 2, 3, 4],
      target: 2,
      expected: 2
    }, {
      arr: [1, 2, 3, 4],
      target: 3,
      expected: 3
    }, {
      arr: [1, 2, 3],
      target: 2,
      expected: 2
    }, {
      arr: [1, 1, 1, 1],
      target: 1,
      expected: 4
    }, {
      arr: [1, 1, 1, 1],
      target: 0,
      expected: 0
    }, {
      arr: [1, 2, 2, 2, 5],
      target: 2,
      expected: 4
    }]

    testCases.forEach((tc, idx) => {
      it(`should compute correct amount for test case ${idx}`, () => {
        expect(util.calcNumLessThan(tc.arr, tc.target)).toBe(tc.expected)
      })
    })
  })
})
