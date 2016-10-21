/* global describe, expect, it */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'
import { Provider } from 'react-redux'

import { makeMockStore, mockStoreData } from '../../test-utils/mock-store.js'

import Site from '../../../client/containers/site'

const mockStore = makeMockStore(mockStoreData)

describe('Container > Site', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Site />
      </Provider>
    )
    expect(mountToJson(tree.find(Site))).toMatchSnapshot()
  })
})
