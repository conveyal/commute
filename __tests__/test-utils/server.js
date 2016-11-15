/* globals expect */

export const parseServerResponse = (res) => {
  let json
  try {
    json = JSON.parse(res.text)
  } catch (e) {
    console.error('Unable to parse server response into JSON')
    console.log(res.text)
    throw e
  }
  expect(json.errors).toBeFalsy()
  expect(res.status).toBe(200)
  return json
}
