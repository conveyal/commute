/* globals describe, expect, it */

import moment from 'moment'

const expectFetchActionAndGetNextFn = (action, url, optionsToAssertEqual) => {
  // expect fetch type to be handled by middleware
  expect(action.type).toEqual('fetch')

  // parse payload
  const payload = action.payload
  // expect url to match expectation
  expect(payload.url).toEqual(url)
  // expect next function to exist
  expect(payload.next).toBeTruthy()
  // expect the options to equal optionsToAssertEqual argument if it is provided
  if (optionsToAssertEqual) {
    expect(payload.options).toEqual(optionsToAssertEqual)
  }
  return payload.next
}

/**
 * Make tests for generated generic model actions
 *
 * @param  {Object} cfg An object with the following parameters:
 * - actions: The actions to test
 * - commands: An object with the keys being commands and the corresponding cfg of each command
 * -- args: The arguments sent to the action
 * - pluralName: Plural name of the model
 * - singularName: Singular name of the model
 */
export function makeGenericModelActionsTests (cfg) {
  const {actions, commands, singularName, pluralName} = cfg

  const addLocallyType = `add ${singularName}`
  const deleteLocallyType = `delete ${singularName}`
  const setLocallyType = `set ${singularName}`
  const setAllLocallyType = `set ${pluralName}`

  const baseEndpoint = `/api/${singularName}`

  describe('generic model actions', () => {
    if (commands['Collection GET']) {
      const testCfg = commands['Collection GET']

      it('loadAll should work', () => {
        // expect action to exist
        expect(actions['loadAll']).toBeTruthy()

        // expect fetch action to be returned
        const nextFn = expectFetchActionAndGetNextFn(actions.loadAll(testCfg.args), baseEndpoint)

        // execute nextFn with mock server response
        const nextFnResult = nextFn({ value: 'mock data' })

        // expect single setAllLocallyType action as a result
        expect(nextFnResult.type).toEqual(setAllLocallyType)
        expect(nextFnResult.payload).toEqual('mock data')
      })
    }

    if (commands['Collection POST']) {
      const testCfg = commands['Collection POST']
      const newEntity = testCfg.args

      it('create should work', () => {
        // expect action to exist
        expect(actions['create']).toBeTruthy()

        // expect fetch action to be returned
        const nextFn = expectFetchActionAndGetNextFn(actions.create(newEntity),
          baseEndpoint,
          {
            body: newEntity,
            method: 'POST'
          })

        // execute nextFn with mock server response
        const createdEntity = Object.assign(newEntity, { _id: 'new-entity-id' })
        const nextFnResult = nextFn({ value: createdEntity })

        // expect two actions as result
        expect(nextFnResult.length).toEqual(2)

        // expect first action to be addLocallyType
        const firstAction = nextFnResult[0]
        expect(firstAction.type).toEqual(addLocallyType)
        expect(firstAction.payload).toEqual(createdEntity)

        // expect second action to be react router action
        const secondAction = nextFnResult[1]
        // using snapshot here so that changes to react router can be updated quickly
        expect(secondAction).toMatchSnapshot()
      })
    }

    if (commands['DELETE']) {
      const testCfg = commands['DELETE']
      const entity = testCfg.args

      it('delete should work', () => {
        // expect action to exist
        expect(actions['delete']).toBeTruthy()

        // expect fetch action to be returned
        const nextFn = expectFetchActionAndGetNextFn(actions.delete(entity),
          `${baseEndpoint}/${entity._id}`,
          {
            method: 'DELETE'
          })

        // execute nextFn with mock server response
        const nextFnResult = nextFn()

        // expect two actions as result
        expect(nextFnResult.length).toEqual(2)

        // expect first action to be deleteLocallyType
        const firstAction = nextFnResult[0]
        expect(firstAction.type).toEqual(deleteLocallyType)
        expect(firstAction.payload).toEqual(entity._id)

        // expect second action to be react router action
        const secondAction = nextFnResult[1]
        // using snapshot here so that changes to react router can be updated quickly
        expect(secondAction).toMatchSnapshot()
      })
    }

    if (commands['GET']) {
      const testCfg = commands['GET']
      const entityId = testCfg.args

      it('loadOne should work', () => {
        // expect action to exist
        expect(actions['loadOne']).toBeTruthy()

        // expect fetch action to be returned
        const nextFn = expectFetchActionAndGetNextFn(actions.loadOne(entityId),
          `${baseEndpoint}/${entityId}`)

        // execute nextFn with mock server response
        const nextFnResult = nextFn({ value: { _id: entityId } })

        // expect single setAllLocallyType action as a result
        expect(nextFnResult.type).toEqual(setLocallyType)
        expect(nextFnResult.payload).toEqual({ _id: entityId })
      })
    }

    if (commands['PUT']) {
      const testCfg = commands['PUT']
      const entity = testCfg.args

      it('update should work', () => {
        // expect action to exist
        expect(actions['update']).toBeTruthy()

        // expect fetch action to be returned
        const nextFn = expectFetchActionAndGetNextFn(actions.update(entity),
          `${baseEndpoint}/${entity._id}`,
          {
            body: entity,
            method: 'PUT'
          })

        // execute nextFn with mock server response
        const nextFnResult = nextFn({ value: entity })

        // expect two actions as result
        expect(nextFnResult.length).toEqual(2)

        // expect first action to be setLocallyType
        const firstAction = nextFnResult[0]
        expect(firstAction.type).toEqual(setLocallyType)
        expect(firstAction.payload).toEqual(entity)

        // expect second action to be react router action
        const secondAction = nextFnResult[1]
        // using snapshot here so that changes to react router can be updated quickly
        expect(secondAction).toMatchSnapshot()
      })
    }
  })
}

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
  expectNavigateToNewEntity(actions[1], newId)
}

export function expectCreateAnalysis (actions) {
  expectCreateAction(actions.slice(0, 2))
}

export function expectCreateCommuter (actions) {
  // expect 2 actions
  // - add commuter
  // - react-router navigate back to commuter group
  expect(actions.length).toBe(2)
  const create = actions[0]
  delete create.payload.id
  expect(create).toMatchSnapshot()

  // react-router
  // - expect navigation back to parent group
  expect(actions[1]).toMatchSnapshot()
}

export function expectCreateSite (actions) {
  // expect 2 actions
  // - add site
  // - react-router navigate back to organization
  expect(actions.length).toBe(2)
  const create = actions[0]
  delete create.payload.id
  expect(create).toMatchSnapshot()

  // react-router
  // - expect navigation back to parent organization
  expect(actions[1]).toMatchSnapshot()
}

export function expectDeleteAction (actions) {
  expect(actions.length).toBeGreaterThan(0)
  expect(actions).toMatchSnapshot()
}

export function expectDeleteAgency (actions) {
  // Then the agency should be deleted from the database
  // And the agency should be removed from the list of agencies
  expectDeleteAction(actions)
}

export function expectDeleteAnalysis (actions) {
  // Then the analysis should be deleted from the database
  // And the analysis should be removed from the respective organization on the website
  expectDeleteAction(actions)
}

export function expectDeleteCommuter (actions) {
  // Then the analysis should be deleted from the database
  // And the analysis should be removed from the respective organization on the website
  expectDeleteAction(actions)
}

export function expectDeleteGroup (actions) {
  // Then the commuter group and all associated analyses should be deleted from the database
  // And the commuter group and all associated analyses should be removed
  // from the respective organization on the website
  expectDeleteAction(actions)
}

export function expectDeleteOrganization (actions) {
  // Then the organization and all associated sites, groups and analyses
  // should be deleted from the database
  // And the organization should be removed from the list of organizations
  expectDeleteAction(actions)
}

export function expectDeleteSite (actions) {
  // Then the site and all associated analyses should be deleted from the database
  // And the site and all associated analyses should be removed from the
  // respective organization on the website
  expectDeleteAction(actions)
}

function expectNavigateToNewEntity (action, newEntityId) {
  expect(action.payload.args[0]).toContain(newEntityId)
  action.payload.args[0] = action.payload.args[0].replace(newEntityId, 'new-entity-id')
  expect(action).toMatchSnapshot()
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

export function expectUpdateGroup (actions) {
  expect(actions.length).toBe(1)

  // handle update
  const update = actions[0]
  expect(update).toMatchSnapshot()
}
