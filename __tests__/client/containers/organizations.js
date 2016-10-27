/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import Organizations from '../../../client/containers/organizations'

describe('Container > Organizations', () => {
  it('Organizations View loads', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.init)}>
        <Organizations />
      </Provider>
    )
    expect(mountToJson(tree.find(Organizations))).toMatchSnapshot()
  })

  it('Organizations View loads with one organization', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.oneSimpleOrganization)}>
        <Organizations />
      </Provider>
    )
    expect(mountToJson(tree.find(Organizations))).toMatchSnapshot()
  })

  it('Navigate to Create/Edit Organization View in create mode', () => {
    throw new Error('unimplemented')
  })

  it('Navigate to Organization View', () => {
    throw new Error('unimplemented')
  })

  it('Navigate to Create/Edit Organization View in edit mode', () => {
    throw new Error('unimplemented')
  })

  it('Delete Organization', () => {
    throw new Error('unimplemented')
  })
})
