/* globals describe, expect, it */

import {expectDeepEqual} from './common'

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
    // do own deep equal because test case fails weirdly
    try {
      expectDeepEqual(payload.options, optionsToAssertEqual)
    } catch (e) {
      console.error('Not deep equal')
      console.error(payload.options)
      console.error(optionsToAssertEqual)
      throw e
    }
  }
  return payload.next
}

/**
 * Make generic action assertion suites
 *
 * @param  {Object} cfg   Configuration as follows:
 * - pluralName: Plural name of the model
 * - singularName: Singular name of the model
 */
export function makeGenericModelActionsExpectations (cfg) {
  const {pluralName, singularName} = cfg

  const addLocallyType = `add ${singularName}`
  const deleteLocallyType = `delete ${singularName}`
  const setLocallyType = `set ${singularName}`
  const setAllLocallyType = `set ${pluralName}`

  const baseEndpoint = `/api/${singularName}`

  return {
    /**
     * Expect a create action
     *
     * @param  {Object} expectationCfg  Configuration as follows:
     * - action:    The action to test
     * - newEntity: The new entity that was sent for creation
     */
    expectCreateAction: (expectationCfg) => {
      const {action, newEntity} = expectationCfg

      // expect fetch action to be returned
      const nextFn = expectFetchActionAndGetNextFn(action,
        baseEndpoint,
        {
          body: [newEntity],
          method: 'POST'
        })

      // execute nextFn with mock server response
      const createdEntities = [Object.assign(newEntity, { _id: 'new-entity-id' })]
      const nextFnResult = nextFn(null, { value: createdEntities })

      // expect two actions as result
      expect(nextFnResult.length).toEqual(2)

      // expect first action to be addLocallyType
      const firstAction = nextFnResult[0]
      expect(firstAction.type).toEqual(addLocallyType)
      expect(firstAction.payload).toEqual(createdEntities[0])

      // expect second action to be react router action
      const secondAction = nextFnResult[1]
      // using snapshot here so that changes to react router can be updated quickly
      expect(secondAction).toMatchSnapshot()
    },
    /**
     * Expect a delete action
     *
     * @param  {Object} expectationCfg  Configuration as follows:
     * - action:  The action to test
     * - entity:  The entity to delete
     */
    expectDeleteAction: (expectationCfg) => {
      const {action, entity} = expectationCfg

      // expect fetch action to be returned
      const nextFn = expectFetchActionAndGetNextFn(action,
        `${baseEndpoint}/${entity._id}`,
        {
          method: 'DELETE'
        })

      // execute nextFn with mock server response
      const nextFnResult = nextFn()

      // expect two actions as result
      expect(nextFnResult.length).toEqual(2)

      // expect first action to be react router action
      const routeAction = nextFnResult[0]
      // using snapshot here so that changes to react router can be updated quickly
      expect(routeAction).toMatchSnapshot()

      // expect second action to be deleteLocallyType
      const deleteAction = nextFnResult[1]
      expect(deleteAction.type).toEqual(deleteLocallyType)
      expect(deleteAction.payload).toEqual(entity)
    },
    /**
     * Expect a load all action
     *
     * @param  {Object} expectationCfg  Configuration as follows:
     * - action:  The action to test
     */
    expectloadManyAction: (expectationCfg) => {
      const {action} = expectationCfg

      // expect fetch action to be returned
      const nextFn = expectFetchActionAndGetNextFn(action, baseEndpoint)

      // execute nextFn with mock server response
      const nextFnResult = nextFn(null, { value: 'mock data' })

      // expect single setAllLocallyType action as a result
      expect(nextFnResult.type).toEqual(setAllLocallyType)
      expect(nextFnResult.payload).toEqual('mock data')
    },
    /**
     * Expect a loadOne action
     *
     * @param  {Object} expectationCfg  Configuration as follows:
     * - action:  The action to test
     * - entityId:  The entityId to test with
     */
    expectLoadOneAction: (expectationCfg) => {
      const {action, entityId} = expectationCfg

      // expect fetch action to be returned
      const nextFn = expectFetchActionAndGetNextFn(action,
        `${baseEndpoint}/${entityId}`)

      // execute nextFn with mock server response
      const nextFnResult = nextFn(null, { value: { _id: entityId } })

      // expect single setAllLocallyType action as a result
      expect(nextFnResult.type).toEqual(setLocallyType)
      expect(nextFnResult.payload).toEqual({ _id: entityId })
    },
    /**
     * Expect an update action
     *
     * @param  {Object} expectationCfg  Configuration as follows:
     * - action:  The action to test
     * - entity:  The entity to update
     */
    expectUpdateAction: (expectationCfg) => {
      const {action, entity} = expectationCfg

      // expect fetch action to be returned
      const nextFn = expectFetchActionAndGetNextFn(action,
        `${baseEndpoint}/${entity._id}`,
        {
          body: entity,
          method: 'PUT'
        })

      // execute nextFn with mock server response
      const nextFnResult = nextFn(null, { value: entity })

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
    }
  }
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
  const genericExpectations = makeGenericModelActionsExpectations({
    pluralName,
    singularName
  })

  describe('generic model actions', () => {
    if (commands['Collection GET']) {
      const testCfg = commands['Collection GET']

      it('loadMany should work', () => {
        // expect action to exist
        expect(actions['loadMany']).toBeTruthy()

        genericExpectations.expectloadManyAction({ action: actions.loadMany(testCfg.args) })
      })
    }

    if (commands['Collection POST']) {
      const testCfg = commands['Collection POST']
      const newEntity = testCfg.args

      it('create should work', () => {
        // expect action to exist
        expect(actions['create']).toBeTruthy()

        genericExpectations.expectCreateAction({
          action: actions.create(newEntity),
          newEntity
        })
      })
    }

    if (commands['DELETE']) {
      const testCfg = commands['DELETE']
      const entity = testCfg.args

      it('delete should work', () => {
        // expect action to exist
        expect(actions['delete']).toBeTruthy()

        genericExpectations.expectDeleteAction({
          action: actions.delete(entity),
          entity
        })
      })
    }

    if (commands['GET']) {
      const testCfg = commands['GET']
      const entityId = testCfg.args

      it('loadOne should work', () => {
        // expect action to exist
        expect(actions['loadOne']).toBeTruthy()

        genericExpectations.expectLoadOneAction({
          action: actions.loadOne(entityId),
          entityId
        })
      })
    }

    if (commands['PUT']) {
      const testCfg = commands['PUT']
      const entity = testCfg.args

      it('update should work', () => {
        // expect action to exist
        expect(actions['update']).toBeTruthy()

        genericExpectations.expectUpdateAction({
          action: actions.update(entity),
          entity
        })
      })
    }
  })
}
