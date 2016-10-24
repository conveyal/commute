/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {expectCreateAction} from '../actions/organization'
import {makeMockStore, mockStores} from '../../test-utils/mock-store.js'

import CreateOrganization from '../../../client/containers/create-organization'

describe('Container > CreateOrganization', () => {
  it('renders correctly', () => {
    const mockStore = makeMockStore(mockStores.init)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CreateOrganization />
      </Provider>
    )
    expect(mountToJson(tree.find(CreateOrganization))).toMatchSnapshot()
  })

  it('can create an organization', () => {
    const mockStore = makeMockStore(mockStores.init)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <CreateOrganization />
      </Provider>
    )

    // give each text field some input
    tree.find('input').map((input) => input.simulate('change', {target: {value: 'My new value'}}))

    // submit form
    tree.find('form').find('button').simulate('click')

    // expect create action
    expectCreateAction(mockStore.getActions())
  })
})
