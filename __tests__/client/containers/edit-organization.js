/* global describe, expect, it */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'
import { Provider } from 'react-redux'

import { makeMockStore, mockStoreData } from '../../test-utils/mock-store.js'

import EditOrganization from '../../../client/containers/edit-organization'

const mockStore = makeMockStore(mockStoreData)

describe('Container > EditOrganization', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditOrganization />
      </Provider>
    )
    expect(mountToJson(tree.find(EditOrganization))).toMatchSnapshot()
  })
})
