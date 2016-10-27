/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {expectCreateAction} from '../actions/organization'
import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import EditOrganization from '../../../client/containers/edit-organization'

describe('Container > EditOrganization', () => {
  it('Create/Edit Organization View loads (create or edit mode)', () => {
    const mockStore = makeMockStore(mockStores.init)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditOrganization />
      </Provider>
    )
    expect(mountToJson(tree.find(EditOrganization))).toMatchSnapshot()
  })

  it('Create/Edit Organization View loads in edit mode', () => {
    throw new Error('unimplemented')
  })

  it('Create organization', () => {
    const mockStore = makeMockStore(mockStores.init)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditOrganization />
      </Provider>
    )

    // give each text field some input
    tree.find('input').map((input) => input.simulate('change', {target: {value: 'My new value'}}))

    // submit form
    tree.find('form').find('button').simulate('click')

    // expect create action
    expectCreateAction(mockStore.getActions())
  })

  it('Delete organization', () => {
    throw new Error('unimplemented')
  })

  it('Navigate back to Organization View', () => {
    throw new Error('unimplemented')
  })
})
