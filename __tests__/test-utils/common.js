
export function requireKeys (obj, required) {
  required.forEach((k) => {
    if (!obj[k]) {
      throw new Error(`${k} is required for this test`)
    }
  })
}
