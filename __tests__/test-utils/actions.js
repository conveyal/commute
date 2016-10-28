/* globals expect */

export function expectCreateAction (actions) {
  // expect 2 actions
  // - add organization
  // - react-router navigate to home
  expect(actions.length).toBe(2)
  const create = actions[0]
  delete create.payload.id
  expect(create).toMatchSnapshot()

  // react-router
  expect(actions[1]).toMatchSnapshot()
}

export function expectDeleteOrganization (actions) {
  // Then the organization and all associated sites, groups and analyses
  // should be deleted from the database
  // And the organization should be removed from the list of organizations
  expect(actions.length).toBeGreaterThan(0)
  expect(actions).toMatchSnapshot()
}
