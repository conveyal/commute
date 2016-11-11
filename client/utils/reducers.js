export function arrayToObj (a) {
  const obj = {}
  for (let i = 0; i < a.length; i++) obj[a[i].id] = a[i]
  return obj
}

/**
 * Round a number to a fixed amount of decimal places
 *
 * @param  {Number} n      The number to round
 * @param  {Number} places The number of places to round to (default=2)
 * @return {Number}        The rounded number
 */
export function fixedRound (n, places) {
  places = places || 2
  const multiplier = Math.pow(10, places)
  return Math.round(n * multiplier) / multiplier
}
