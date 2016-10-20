/* global describe, expect, it */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'
import { Provider } from 'react-redux'

import { makeMockStore, mockStoreData } from '../../../test-utils/mock-store.js'

import Organization from '../../../client/containers/organization'

const mockStore = makeMockStore(mockStoreData)

describe('Container > Organization', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Organization />
      </Provider>
    )
    expect(mountToJson(tree.find(Organization))).toMatchSnapshot()
  })
})
