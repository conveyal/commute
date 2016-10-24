/* global describe, expect, it */

import * as organization from '../../../client/actions/organization'

describe('actions > organization', () => {
  it('create organization should work', () => {
    const fieldData = {
      name: 'mockOrg'
    }
    const result = organization.createOrganization(fieldData)

    expectCreateAction(result)
  })

  it('create site should work', () => {
    const fieldData = {
      name: 'mockSite',
      organizationId: '1'
    }
    const result = organization.createSite(fieldData)

    expectCreateAction(result)
  })
})

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
