/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-store.js'

import Organizations from '../../../client/containers/organizations'

describe('Container > Organizations', () => {
  it('renders correctly without any organizations', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.init)}>
        <Organizations />
      </Provider>
    )
    expect(mountToJson(tree.find(Organizations))).toMatchSnapshot()
  })

  it('renders correctly with one organization', () => {
    // mount component
    const tree = mount(
      <Provider store={makeMockStore(mockStores.oneSimpleOrganization)}>
        <Organizations />
      </Provider>
    )
    expect(mountToJson(tree.find(Organizations))).toMatchSnapshot()
  })
})
