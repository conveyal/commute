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

  /* it('Delete Site', () => {
    throw new Error('unimplemented')
  })

  it('Delete Commuter Group', () => {
    throw new Error('unimplemented')
  })

  it('Delete Analysis', () => {
    throw new Error('unimplemented')
  }) */
})
