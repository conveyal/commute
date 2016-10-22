/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStoreData} from '../../test-utils/mock-store.js'

import EditGroup from '../../../client/containers/edit-group'

const mockStore = makeMockStore(mockStoreData)

describe('Container > EditGroup', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditGroup />
      </Provider>
    )
    expect(mountToJson(tree.find(EditGroup))).toMatchSnapshot()
  })
})
