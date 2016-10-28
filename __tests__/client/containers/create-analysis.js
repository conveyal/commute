/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import CreateAnalysis from '../../../client/containers/create-analysis'

const mockStore = makeMockStore(mockStores.init)

describe('Container > CreateAnalysis', () => {
  it('Create Analysis View loads', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CreateAnalysis />
      </Provider>
    )
    expect(mountToJson(tree.find(CreateAnalysis))).toMatchSnapshot()
  })

  /* it('Create analysis', () => {
    throw new Error('unimplemented')
  }) */
})
