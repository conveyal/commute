/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {expectCreateAction} from '../actions/organization'
import {makeMockStore, mockStores} from '../../test-utils/mock-store.js'

import CreateSite from '../../../client/containers/create-site'

const mockStore = makeMockStore(mockStores.init)

describe('Container > CreateSite', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CreateSite
          params={{organizationId: '1'}}
          />
      </Provider>
    )
    expect(mountToJson(tree.find(CreateSite))).toMatchSnapshot()
  })

  it('can create an organization', () => {
    const mockStore = makeMockStore(mockStores.init)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CreateSite
          params={{organizationId: '1'}}
          />
      </Provider>
    )

    // give each text field some input
    tree.find('input').map((input) => input.simulate('change', {target: {value: 'My new value'}}))

    // TODO: simulate receiving of react-select-geocoder input
    // tree.find(CreateSite).handleGeocoderChange('123 ABC St') <-- doesn't work.  Can't figure out working solution.

    // submit form
    tree.find('form').find('button').simulate('click')

    // expect create action
    expectCreateAction(mockStore.getActions())
  })
})
