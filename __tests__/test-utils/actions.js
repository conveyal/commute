/* globals expect */

import moment from 'moment'

export function expectCreateAction (actions) {
  // expect 2 actions
  // - add organization
  // - react-router navigate to newly created entity
  expect(actions.length).toBe(2)

  // handle create
  const create = actions[0]
  const newId = create.payload.id
  delete create.payload.id
  // handle analysis lastRunDateTime if present
  if (create.payload.lastRunDateTime) {
    expect(create.payload.lastRunDateTime).toBeGreaterThan(moment().unix() - 10)
    delete create.payload.lastRunDateTime
  }
  expect(create).toMatchSnapshot()

  // react-router
  const navigate = actions[1]
  expect(navigate.payload.args[0]).toContain(newId)
  navigate.payload.args[0] = navigate.payload.args[0].replace(newId, 'new-entity-id')
  expect(navigate).toMatchSnapshot()
}

export function expectCreateSite (actions) {
  // expect 2 actions
  // - add organization
  // - react-router navigate back to organization
  expect(actions.length).toBe(2)
  const create = actions[0]
  delete create.payload.id
  expect(create).toMatchSnapshot()

  // react-router
  expect(actions[1]).toMatchSnapshot()
}

export function expectDeleteAnalysis (actions) {
  // Then the analysis should be deleted from the database
  // And the analysis should be removed from the respective organization on the website
  expect(actions.length).toBeGreaterThan(0)
  expect(actions).toMatchSnapshot()
}

export function expectDeleteGroup (actions) {
  // Then the commuter group and all associated analyses should be deleted from the database
  // And the commuter group and all associated analyses should be removed
  // from the respective organization on the website
  expect(actions.length).toBeGreaterThan(0)
  expect(actions).toMatchSnapshot()
}

export function expectDeleteOrganization (actions) {
  // Then the organization and all associated sites, groups and analyses
  // should be deleted from the database
  // And the organization should be removed from the list of organizations
  expect(actions.length).toBeGreaterThan(0)
  expect(actions).toMatchSnapshot()
}

export function expectDeleteSite (actions) {
  // Then the site and all associated analyses should be deleted from the database
  // And the site and all associated analyses should be removed from the
  // respective organization on the website
  expect(actions.length).toBeGreaterThan(0)
  expect(actions).toMatchSnapshot()
}
