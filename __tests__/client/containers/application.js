/* global describe, it */

import {mount} from 'enzyme'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import Application from '../../../client/containers/application'

const mockStore = makeMockStore(mockStores.init)

describe('Container > Application', () => {
  it('Website Loads With Existing User', () => {
    window.fakePath = '/'

    // mount component
    mount(
      <Provider store={mockStore}>
        <Application />
      </Provider>
    )
  })
})
