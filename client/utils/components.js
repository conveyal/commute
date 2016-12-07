import analysisDefaults from './analysisDefaults'

/**
 * Calculate number of elements in array less than or equal to target values
 *
 * @param  {Number[]} arr     A sorted array of numbers
 * @param  {[Number]} target  The number to be less than or equal to
 * @return {int}              The number of elements in the array less than or equal to the target value
 */
export function calcNumLessThan (arr, target) {
  // do binary search
  let left = 0
  let right = arr.length - 1
  let mid

  while (left <= right) {
    mid = Math.floor((left + right) / 2)
    if (arr[mid] <= target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return left
}

/**
 * Helper function to get initial series data for drawing graphs
 *
 * @return {Obj[]} Array of objects with series template
 */
export function getInitialSeries () {
  const modes = Object.keys(analysisDefaults.modeDisplay)
  const series = []

  modes.forEach((mode) => {
    series.push(Object.assign({disabled: false, mode}, analysisDefaults.modeDisplay[mode]))
  })

  return series
}

/**
 * Humanize distances
 * // TODO: more humanization
 *
 * @param  {float} d Distance to humanize
 * @return {string} humanized distance
 */
export function humanizeDistance (d) {
  return `${d} miles`
}
