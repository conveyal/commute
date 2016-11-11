/* global describe, expect, it */

import {expectCreateAction, expectDeleteOrganization} from '../../test-utils/actions'
import {simpleOrganization} from '../../test-utils/mock-data'

import * as organization from '../../../client/actions/organization'

describe('actions > organization', () => {
  it('create organization should work', () => {
    const data = {
      name: 'mockOrg'
    }
    const result = organization.createOrganization(data)

    expectCreateAction(result)
  })

  it('update organization should work', () => {
    const result = organization.updateOrganization(simpleOrganization)

    expect(result.length).toBe(2)
    expect(result).toMatchSnapshot()
  })

  it('delete organization should work', () => {
    const result = organization.deleteOrganization('1')

    expectDeleteOrganization(result)
  })
})
