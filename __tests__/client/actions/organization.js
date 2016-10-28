/* global describe, expect, it */

import {expectCreateAction} from '../../test-utils/actions'

import * as organization from '../../../client/actions/organization'

describe('actions > organization', () => {
  it('create organization should work', () => {
    const fieldData = {
      name: 'mockOrg'
    }
    const result = organization.createOrganization(fieldData)

    expectCreateAction(result)
  })

  it('delete organization should work', () => {
    const result = organization.deleteOrganization('1')

    expect(result.length).toBe(1)
    expect(result).toMatchSnapshot()
  })
})
