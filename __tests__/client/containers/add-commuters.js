/* global describe, expect, File, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {expectAppendCommuters, expectCreateGroup} from '../../test-utils/actions'
import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import AddCommuters from '../../../client/containers/add-commuters'

const mockCsvFile = new File(['id,name,email,address\n1,Bob,a@b.c,"123 Main St"'], 'mockFile.csv')

describe('Container > AddCommuters', () => {
  it('Add Commuters View loads (create mode)', () => {
    const mockStore = makeMockStore(mockStores.oneSimpleOrganization)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <AddCommuters
          params={{organizationId: '1'}}
          />
      </Provider>
    )
    expect(mountToJson(tree.find(AddCommuters))).toMatchSnapshot()
  })

  it('Add Commuters View loads (with existing commuter group)', () => {
    // Given a logged-in user
    const mockStore = makeMockStore(mockStores.complexOrganization)

    // When the Add Commuters View is to be loaded
    // And the previous view was the Commuter Group View
    const tree = mount(
      <Provider store={mockStore}>
        <AddCommuters
          params={{organizationId: '2', groupId: '1'}}
          />
      </Provider>
    )

    // Then the Add Commuters View should load
    // And the commuter group name field should be populated and disabled
    // And there should be a button to go back to the Commuter Group
    expect(mountToJson(tree.find(AddCommuters))).toMatchSnapshot()
  })

  it('Preview Add Commuters', (done) => {
    // Given a logged-in user is viewing the Add Commuters View
    const mockStore = makeMockStore(mockStores.oneSimpleOrganization)
    const tree = mount(
      <Provider store={mockStore}>
        <AddCommuters
          params={{organizationId: '1'}}
          />
      </Provider>
    )

    // When a user selects a file to be uploaded
    // Then the file should be parsed
    tree.find('Dropzone').props().onDrop([mockCsvFile])

    // jsdom's filereader is asyncrhonous, so wait til it finishes
    setTimeout(() => {
      // And if the file is valid a preview of the commuters should
      // be shown in a table within an accordion
      expect(mountToJson(tree.find(AddCommuters))).toMatchSnapshot()
      done()
    }, 1000)
  })

  it('Create Commuter Group', () => {
    // Given a logged-in user is viewing the Add Commuters View
    const mockStore = makeMockStore(mockStores.oneSimpleOrganization)
    const tree = mount(
      <Provider store={mockStore}>
        <AddCommuters
          params={{organizationId: '1'}}
          />
      </Provider>
    )

    // When the user fills out all of the required fields (Name)
    tree.find('input').first().simulate('change', {target: {value: 'Mock Name'}})

    // And the user submits the form
    tree.find('form').find('button').simulate('click')

    expectCreateGroup(mockStore.getActions())
  })

  it('Append Commuters to existing commuter group', (done) => {
    // Given a logged-in user is viewing the Add Commuters View
    // And the user is adding commuters to an existing group
    const mockStore = makeMockStore(mockStores.complexOrganization)
    const tree = mount(
      <Provider store={mockStore}>
        <AddCommuters
          params={{organizationId: '2', groupId: '1'}}
          />
      </Provider>
    )

    // When a user selects a file to be uploaded
    tree.find('Dropzone').props().onDrop([mockCsvFile])

    // jsdom's filereader is asyncrhonous, so wait til it finishes
    setTimeout(() => {
      // And the user submits the form
      tree.find('form').find('button').simulate('click')

      expectAppendCommuters(mockStore.getActions())
      done()
    }, 1000)
  })
})
