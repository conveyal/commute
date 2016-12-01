/* global describe, expect, File, it */

import {mount} from 'enzyme'
import pretty from 'pretty'
import React from 'react'
import {Provider} from 'react-redux'

import {makeGenericModelActionsExpectations} from '../../test-utils/actions'
import {makeMockStore, mockStores} from '../../test-utils/mock-data.js'

import AddCommuters from '../../../client/containers/add-commuters'

const commuterExpectations = makeGenericModelActionsExpectations({
  pluralName: 'commuters',
  singularName: 'commuter'
})
const groupExpectations = makeGenericModelActionsExpectations({
  pluralName: 'groups',
  singularName: 'group'
})

// include id field in csv file for consistent testing results, normally it should be omitted
const mockCsvFile = new File(['_id,name,email,address\n1,Bob,a@b.c,"123 Main St"'], 'mockFile.csv')

describe('Container > AddCommuters', () => {
  it('Add Commuters View loads (create mode)', () => {
    const mockStore = makeMockStore(mockStores.withBlankOrganization)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <AddCommuters
          params={{organizationId: 'organization-1'}}
          />
      </Provider>
    )
    expect(pretty(tree.find(AddCommuters).html())).toMatchSnapshot()
  })

  it('Add Commuters View loads (with existing commuter group)', () => {
    // Given a logged-in user
    const mockStore = makeMockStore(mockStores.withAnalysisRun)

    // When the Add Commuters View is to be loaded
    // And the previous view was the Commuter Group View
    const tree = mount(
      <Provider store={mockStore}>
        <AddCommuters
          params={{groupId: 'group-2'}}
          />
      </Provider>
    )

    // Then the Add Commuters View should load
    // And the commuter group name field should be populated and disabled
    // And there should be a button to go back to the Commuter Group
    expect(pretty(tree.find(AddCommuters).html())).toMatchSnapshot()
  })

  it('Preview Add Commuters', (done) => {
    // Given a logged-in user is viewing the Add Commuters View
    const mockStore = makeMockStore(mockStores.withBlankOrganization)
    const tree = mount(
      <Provider store={mockStore}>
        <AddCommuters
          params={{organizationId: 'organization-1'}}
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
      expect(pretty(tree.find(AddCommuters).html())).toMatchSnapshot()
      done()
    }, 1000)
  })

  it('Create Commuter Group', () => {
    // Given a logged-in user is viewing the Add Commuters View
    const mockStore = makeMockStore(mockStores.withBlankOrganization)
    const tree = mount(
      <Provider store={mockStore}>
        <AddCommuters
          params={{organizationId: 'organization-1'}}
          />
      </Provider>
    )

    // When the user fills out all of the required fields (Name)
    tree.find('input').first().simulate('change', {target: {value: 'Mock Name'}})

    // And the user submits the form
    tree.find('form').find('button').simulate('click')

    groupExpectations.expectCreateAction({
      action: mockStore.getActions()[0],
      newEntity: {
        name: 'Mock Name',
        organizationId: 'organization-1'
      }
    })
  })

  it('Append Commuters to existing commuter group', (done) => {
    // Given a logged-in user is viewing the Add Commuters View
    // And the user is adding commuters to an existing group
    const mockStore = makeMockStore(mockStores.withAnalysisRun)
    const tree = mount(
      <Provider store={mockStore}>
        <AddCommuters
          params={{groupId: 'group-2'}}
          />
      </Provider>
    )

    // When a user selects a file to be uploaded
    tree.find('Dropzone').props().onDrop([mockCsvFile])

    // jsdom's filereader is asyncrhonous, so wait til it finishes
    setTimeout(() => {
      // And the user submits the form
      tree.find('form').find('button').simulate('click')

      try {
        commuterExpectations.expectCreateAction({
          action: mockStore.getActions()[0],
          newEntity: {
            _id: '1',
            address: '123 Main St',
            email: 'a@b.c',
            groupId: 'group-2',
            name: 'Bob'
          }
        })
      } catch (e) {
        console.error(e)
        throw e
      }
      done()
    }, 1000)
  })
})
