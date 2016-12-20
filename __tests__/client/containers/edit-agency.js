/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeGenericModelActionsExpectations} from '../../test-utils/actions'
import {timeoutPromise} from '../../test-utils/common'
import {blankAgency, makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import EditAgency from '../../../client/containers/edit-agency'

const agencyExpectations = makeGenericModelActionsExpectations({
  pluralName: 'agencies',
  singularName: 'agency'
})

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

  it('Create agency', async () => {
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

    // react-formal submit is asyncrhonous, so wait a bit
    await timeoutPromise(100)

    // expect create action
    agencyExpectations.expectCreateAction({
      action: mockStore.getActions()[0],
      newEntity: {
        name: 'My new value'
      }
    })
  })

  it('Update agency', async () => {
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

    // react-formal submit is asyncrhonous, so wait a bit
    await timeoutPromise(100)

    // expect update action
    agencyExpectations.expectUpdateAction({
      action: mockStore.getActions()[0],
      entity: {
        _id: 'agency-1',
        name: 'My new value'
      }
    })
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

    // clear all loading actions
    mockStore.clearActions()

    // When the user clicks the delete button for an existing agency
    // And the user confirms the Confirm Deletion dialog
    const deleteButton = tree.find('button').last()
    deleteButton.simulate('click')

    agencyExpectations.expectDeleteAction({
      action: mockStore.getActions()[0],
      entity: blankAgency
    })
  })
})
