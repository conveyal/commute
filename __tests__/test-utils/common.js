/* globals expect */

export function expectDeepEqual (actual, expected) {
  if (Array.isArray(actual)) {
    for (let i = 0; i < actual.length; i++) {
      expectDeepEqual(actual[i], expected[i])
    }
  } else if ((actual === undefined || expected === undefined) ||
    (actual === null || expected === null)) {
    expect(actual).toEqual(expected)
  } else if (typeof actual === 'object') {
    Object.keys(actual).forEach((k) => {
      expectDeepEqual(actual[k], expected[k])
    })
  } else {
    expect(actual).toEqual(expected)
  }
}

export function requireKeys (obj, required) {
  required.forEach((k) => {
    if (!obj[k]) {
      throw new Error(`${k} is required for this test`)
    }
  })
}

export function timeoutPromise (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}
