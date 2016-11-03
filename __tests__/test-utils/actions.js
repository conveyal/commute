/* globals expect */

import moment from 'moment'

export function expectAppendCommuters (actions) {
  // expect 2 actions
  // - append commuters
  // - react-router navigate to commuter group
  expect(actions.length).toBe(2)
  expect(actions).toMatchSnapshot()
}

export function expectCreateAction (actions, entity) {
  // expect 2 actions
  // - add entity
  // - react-router navigate to newly created entity
  expect(actions.length).toBe(2)

  // handle create
  const create = actions[0]
  if (entity) {
    entity = create.payload[entity]
  } else {
    entity = create.payload
  }
  const newId = entity.id
  delete entity.id
  // handle analysis lastRunDateTime if present
  if (entity.lastRunDateTime) {
    expect(entity.lastRunDateTime).toBeGreaterThan(moment().unix() - 10)
    delete entity.lastRunDateTime
  }
  expect(create).toMatchSnapshot()

  // react-router
  const navigate = actions[1]
  expect(navigate.payload.args[0]).toContain(newId)
  navigate.payload.args[0] = navigate.payload.args[0].replace(newId, 'new-entity-id')
  expect(navigate).toMatchSnapshot()
}

export function expectCreateAnalysis (actions) {
  expectCreateAction(actions, 'analysis')
}

export function expectCreateCommuter (actions) {
  // expect 2 actions
  // - add commuter
  // - react-router navigate back to commuter group
  expect(actions.length).toBe(2)
  const create = actions[0]
  delete create.payload.commuter.id
  expect(create).toMatchSnapshot()

  // react-router
  expect(actions[1]).toMatchSnapshot()
}

export function expectCreateGroup (actions) {
  expectCreateAction(actions, 'group')
}

export function expectCreateSite (actions) {
  // expect 2 actions
  // - add site
  // - react-router navigate back to organization
  expect(actions.length).toBe(2)
  const create = actions[0]
  delete create.payload.site.id
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

export function expectDeleteCommuter (actions) {
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

export function expectUpdateAction (actions) {
  // Then the website should update the entity in the database
  // And the website should modify the entity in the redux store
  // And the website should navigate to the appropriate view

  // expect 2 actions
  // - update entity
  // - react-router navigation
  expect(actions.length).toBe(2)

  // handle update
  const update = actions[0]
  expect(update).toMatchSnapshot()

  // react-router
  const navigate = actions[1]
  expect(navigate).toMatchSnapshot()
}
