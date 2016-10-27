/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import Organization from '../../../client/containers/organization'

describe('Container > Organization', () => {
  it('Organization View loads', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.complexOrganization)}>
        <Organization
          params={{organizationId: '1'}}
          />
      </Provider>
    )
    expect(mountToJson(tree.find(Organization))).toMatchSnapshot()
  })

  it('Navigate to Create/Edit Organization View', () => {
    throw new Error('unimplemented')
  })

  it('Navigate to Create/Edit Site View in create mode', () => {
    throw new Error('unimplemented')
  })

  it('Navigate to Create/Edit Site View in edit mode', () => {
    throw new Error('unimplemented')
  })

  it('Delete Site', () => {
    throw new Error('unimplemented')
  })

  it('Navigate to Add Commuters View', () => {
    throw new Error('unimplemented')
  })

  it('Navigate to Commuter Group View', () => {
    throw new Error('unimplemented')
  })

  it('Delete Commuter Group', () => {
    throw new Error('unimplemented')
  })

  it('Navigate to Create Analysis View', () => {
    throw new Error('unimplemented')
  })

  it('Navigate to Analysis View', () => {
    throw new Error('unimplemented')
  })

  it('Delete Analysis', () => {
    throw new Error('unimplemented')
  })
})
