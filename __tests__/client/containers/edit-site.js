/* global describe, expect, it */

import { mount } from 'enzyme'
import { mountToJson } from 'enzyme-to-json'
import React from 'react'
import { Provider } from 'react-redux'

import { makeMockStore, mockStoreData } from '../../test-utils/mock-store.js'

import EditSite from '../../../client/containers/edit-site'

const mockStore = makeMockStore(mockStoreData)

describe('Container > EditSite', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditSite />
      </Provider>
    )
    expect(mountToJson(tree.find(EditSite))).toMatchSnapshot()
  })
})
