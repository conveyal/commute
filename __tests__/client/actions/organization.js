/* global describe, expect, it */

import {expectCreateAction} from '../../test-utils/actions'
import {simpleOrganization} from '../../test-utils/mock-data'

import * as organization from '../../../client/actions/organization'

describe('actions > organization', () => {
  it('create organization should work', () => {
    const fieldData = {
      name: 'mockOrg'
    }
    const result = organization.createOrganization(fieldData)

    expectCreateAction(result)
  })

  it('update organization should work', () => {
    const result = organization.updateOrganization(simpleOrganization)

    expect(result.length).toBe(1)
    expect(result).toMatchSnapshot()
  })

  it('delete organization should work', () => {
    const result = organization.deleteOrganization('1')

    expect(result.length).toBe(1)
    expect(result).toMatchSnapshot()
  })
})
