/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-store.js'

import Group from '../../../client/containers/group'

const mockStore = makeMockStore(mockStores.init)

describe('Container > Group', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Group />
      </Provider>
    )
    expect(mountToJson(tree.find(Group))).toMatchSnapshot()
  })
})
