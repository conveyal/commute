/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeGenericModelActionsExpectations} from '../../test-utils/actions'
import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import EditOrganization from '../../../client/containers/edit-organization'

const organizationExpectations = makeGenericModelActionsExpectations({
  pluralName: 'organizations',
  singularName: 'organization'
})

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
    organizationExpectations.expectCreateAction({
      action: mockStore.getActions()[0],
      newEntity: {
        agencyId: 'agency-1',
        contact: 'My new value',
        email: 'My new value',
        logo_url: 'My new value',
        main_url: 'My new value',
        name: 'My new value'
      }
    })
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
    organizationExpectations.expectUpdateAction({
      action: mockStore.getActions()[0],
      entity: {
        _id: 'organization-1',
        agencyId: 'agency-3',
        contact: 'My new value',
        email: 'My new value',
        logo_url: 'My new value',
        main_url: 'My new value',
        name: 'My new value'
      }
    })
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

    organizationExpectations.expectDeleteAction({
      action: mockStore.getActions()[0],
      entity: {
        _id: 'organization-1',
        agencyId: 'agency-3',
        email: 'My new value',
        name: 'Mock Organization'
      }
    })
  })
})
