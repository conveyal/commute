/* global describe, expect, it */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'
import { Provider } from 'react-redux'

import { makeMockStore, mockStoreData } from '../../../test-utils/mock-store.js'

import CreateGroup from '../../../client/containers/create-group'

const mockStore = makeMockStore(mockStoreData)

describe('Container > CreateGroup', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CreateGroup />
      </Provider>
    )
    expect(mountToJson(tree.find(CreateGroup))).toMatchSnapshot()
  })
})
