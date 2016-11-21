/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {expectCreateAction, expectDeleteAgency} from '../../test-utils/actions'
import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import EditAgency from '../../../client/containers/edit-agency'

describe('Container > EditAgency', () => {
  it('Create/Edit Agency View loads (create mode)', () => {
    const mockStore = makeMockStore(mockStores.init)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditAgency
          params={{}}
          />
      </Provider>
    )
    expect(mountToJson(tree.find(EditAgency))).toMatchSnapshot()
  })

  it('Create/Edit Agency View loads in edit mode', () => {
    const mockStore = makeMockStore(mockStores.withBlankAgency)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditAgency
          params={{agencyId: 'agency-1'}}
          />
      </Provider>
    )
    expect(mountToJson(tree.find(EditAgency))).toMatchSnapshot()
  })

  it('Create agency', () => {
    const mockStore = makeMockStore(mockStores.init)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditAgency
          params={{}}
          />
      </Provider>
    )

    // give each text field some input
    tree.find('input').map((input) => input.simulate('change', {target: {value: 'My new value'}}))

    // submit form
    tree.find('form').find('button').simulate('click')

    // expect create action
    expectCreateAction(mockStore.getActions())
  })

  it('Update agency', () => {
    const mockStore = makeMockStore(mockStores.withBlankAgency)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditAgency
          params={{agencyId: 'agency-1'}}
          />
      </Provider>
    )

    // give each text field some input
    tree.find('input').map((input) => input.simulate('change', {target: {value: 'My new value'}}))

    // submit form
    tree.find('form').find('button').first().simulate('click')

    // expect update action
    const actions = mockStore.getActions()
    expect(actions.length).toBe(2)
    expect(actions).toMatchSnapshot()
  })

  it('Delete agency', () => {
    const mockStore = makeMockStore(mockStores.withBlankAgency)
    window.confirm = () => true

    // Given a logged-in user is viewing the Create/Edit Agency View
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditAgency
          params={{agencyId: 'agency-1'}}
          />
      </Provider>
    )

    // When the user clicks the delete button for an existing agency
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('button').last()
    deleteButton.simulate('click')

    expectDeleteAgency(mockStore.getActions())
  })
})
