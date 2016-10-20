/* global describe, expect, it */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'
import { Provider } from 'react-redux'

import { makeMockStore, mockStoreData } from '../../../test-utils/mock-store.js'

import CreateSite from '../../../client/containers/create-site'

const mockStore = makeMockStore(mockStoreData)

describe('Container > CreateSite', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CreateSite />
      </Provider>
    )
    expect(mountToJson(tree.find(CreateSite))).toMatchSnapshot()
  })
})
