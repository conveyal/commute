/* globals expect */

export function expectCreateAction (action) {
  // expect 2 actions
  // - add organization
  // - react-router navigate to home
  expect(action.length).toBe(2)
  const create = action[0]
  delete create.payload.id
  expect(create).toMatchSnapshot()

  // react-router
  expect(action[1]).toMatchSnapshot()
}
