/* global describe, expect, it */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'
import { Provider } from 'react-redux'

import { makeMockStore, mockStoreData } from '../../../test-utils/mock-store.js'

import CreateOrganization from '../../../client/containers/create-organization'

const mockStore = makeMockStore(mockStoreData)

describe('Container > CreateOrganization', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CreateOrganization />
      </Provider>
    )
    expect(mountToJson(tree.find(CreateOrganization))).toMatchSnapshot()
  })
})
