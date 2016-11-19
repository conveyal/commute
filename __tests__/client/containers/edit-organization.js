/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {expectCreateAction, expectDeleteOrganization} from '../../test-utils/actions'
import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import EditOrganization from '../../../client/containers/edit-organization'

describe('Container > EditOrganization', () => {
  it('Create/Edit Organization View loads (create or edit mode)', () => {
    const mockStore = makeMockStore(mockStores.withBlankAgency)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditOrganization
          params={{agencyId: 'agency-1'}}
          />
      </Provider>
    )
    expect(mountToJson(tree.find(EditOrganization))).toMatchSnapshot()
  })

  it('Create/Edit Organization View loads in edit mode', () => {
    const mockStore = makeMockStore(mockStores.withBlankOrganization)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditOrganization
          params={{organizationId: 'organization-1'}}
          />
      </Provider>
    )
    expect(mountToJson(tree.find(EditOrganization))).toMatchSnapshot()
  })

  it('Create organization', () => {
    const mockStore = makeMockStore(mockStores.withBlankAgency)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditOrganization
          params={{agencyId: 'agency-1'}}
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

  it('Update organization', () => {
    const mockStore = makeMockStore(mockStores.withBlankOrganization)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditOrganization
          params={{organizationId: 'organization-1'}}
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

  it('Delete organization', () => {
    const mockStore = makeMockStore(mockStores.withBlankOrganization)
    window.confirm = () => true

    // Given a logged-in user is viewing the Create/Edit Organization View
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditOrganization
          params={{organizationId: 'organization-1'}}
          />
      </Provider>
    )

    // When the user clicks the delete button for an existing organization
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('button').last()
    deleteButton.simulate('click')

    expectDeleteOrganization(mockStore.getActions())
  })
})
