/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import Navigation from '../../../client/containers/navigation'

const mockStore = makeMockStore(mockStores.init)

describe('Container > Navigation', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <Navigation />
      </Provider>
    )
    expect(mountToJson(tree.find(Navigation))).toMatchSnapshot()
  })
})
