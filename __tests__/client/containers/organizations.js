/* global describe, expect, it */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'
import { Provider } from 'react-redux'

import { makeMockStore, mockStoreData } from '../../test-utils/mock-store.js'

import Organizations from '../../../client/containers/organizations'

const mockStore = makeMockStore(mockStoreData)

describe('Container > Organizations', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Organizations />
      </Provider>
    )
    expect(mountToJson(tree.find(Organizations))).toMatchSnapshot()
  })
})
