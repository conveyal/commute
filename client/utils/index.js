import currencyFormatter from 'currency-formatter'
import yup from 'yup'

export function actUponConfirmation (confirmationMessage, action) {
  if (window.confirm(confirmationMessage)) {
    action()
  }
}

export function arrayCountRenderer (cell, row) {
  if (Array.isArray(cell)) return cell.length
}

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

export function formatCurrency (n) {
  return currencyFormatter.format(n, { code: 'USD' })
}

export const geocodeResultToState = {
  address: result => result ? result.properties.label : undefined,
  city: result => result ? result.properties.locality : undefined,
  coordinate: result => {
    return result ? {
      lat: result.geometry.coordinates[1],
      lon: result.geometry.coordinates[0]
    } : undefined
  },
  country: result => result ? result.properties.country : undefined,
  county: result => result ? result.properties.county : undefined,
  geocodeConfidence: result => result ? result.properties.confidence : undefined,
  neighborhood: result => result ? result.properties.neighborhood : undefined,
  state: result => result ? result.properties.region : undefined
}

export const geocodeYupSchema = {
  address: yup.string().label('Address').required(),
  city: yup.string(),
  coordinate: yup.object({
    lon: yup.number().required(),
    lat: yup.number().required()
  }),
  country: yup.string(),
  county: yup.string(),
  geocodeConfidence: yup.number(),
  neighborhood: yup.string(),
  original_address: yup.string(),
  state: yup.string().required()
}

/**
 * Humanize distances
 * // TODO: more humanization
 *
 * @param  {float} d    Distance to humanize
 * @param  {int} places number of decimal places to round to
 * @return {string}     humanized distance
 */
export function humanizeDistance (d, places) {
  places = places || 1
  return `${fixedRound(d, places)} miles`
}
