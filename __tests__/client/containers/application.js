/* global describe, it */

import { mount } from 'enzyme'
import React from 'react'
import { Provider } from 'react-redux'

import { makeMockStore, mockStoreData } from '../../test-utils/mock-store.js'

import Application from '../../../client/containers/application'

const mockStore = makeMockStore(mockStoreData)

describe('Container > Application', () => {
  it('renders correctly', () => {
    // mount component
    mount(
      <Provider store={mockStore}>
        <Application />
      </Provider>
    )
  })
})
