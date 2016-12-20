/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeGenericModelActionsExpectations} from '../../test-utils/actions'
import {timeoutPromise} from '../../test-utils/common'
import {blankOrganization, makeMockStore, mockStores} from '../../test-utils/mock-data.js'

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

  it('Create organization', async () => {
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
    tree.find('input[name="name"]').simulate('change', {target: {value: 'Conveyal'}})
    tree.find('input[name="main_url"]').simulate('change', {target: {value: 'http://www.conveyal.com'}})
    tree.find('input[name="logo_url"]').simulate('change', {target: {value: 'http://www.conveyal.com/logo.jpg'}})
    tree.find('input[name="contact"]').simulate('change', {target: {value: 'Kanye West'}})
    tree.find('input[name="email"]').simulate('change', {target: {value: 'kwest@conveyal.com'}})

    // submit form
    tree.find('form').find('button').simulate('click')

    // react-formal submit is asyncrhonous, so wait a bit
    await timeoutPromise(100)

    // expect create action
    organizationExpectations.expectCreateAction({
      action: mockStore.getActions()[0],
      newEntity: {
        agencyId: 'agency-1',
        contact: 'Kanye West',
        email: 'kwest@conveyal.com',
        logo_url: 'http://www.conveyal.com/logo.jpg',
        main_url: 'http://www.conveyal.com',
        name: 'Conveyal'
      }
    })
  })

  it('Update organization', async () => {
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
    tree.find('input[name="name"]').simulate('change', {target: {value: 'Conveyal'}})
    tree.find('input[name="main_url"]').simulate('change', {target: {value: 'http://www.conveyal.com'}})
    tree.find('input[name="logo_url"]').simulate('change', {target: {value: 'http://www.conveyal.com/logo.jpg'}})
    tree.find('input[name="contact"]').simulate('change', {target: {value: 'Kanye West'}})
    tree.find('input[name="email"]').simulate('change', {target: {value: 'kwest@conveyal.com'}})

    // submit form
    tree.find('form').find('button').first().simulate('click')

    // react-formal submit is asyncrhonous, so wait a bit
    await timeoutPromise(100)

    // expect update action
    organizationExpectations.expectUpdateAction({
      action: mockStore.getActions()[0],
      entity: {
        _id: 'organization-1',
        agencyId: 'agency-3',
        contact: 'Kanye West',
        email: 'kwest@conveyal.com',
        logo_url: 'http://www.conveyal.com/logo.jpg',
        main_url: 'http://www.conveyal.com',
        name: 'Conveyal'
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

    // clear all loading actions
    mockStore.clearActions()

    // When the user clicks the delete button for an existing organization
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('button').last()
    deleteButton.simulate('click')

    organizationExpectations.expectDeleteAction({
      action: mockStore.getActions()[0],
      entity: blankOrganization
    })
  })
})
