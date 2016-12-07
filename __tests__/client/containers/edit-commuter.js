/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeGenericModelActionsExpectations} from '../../test-utils/actions'
import {
  genGeocodedEntity,
  makeMockStore,
  mockCommuter,
  mockGeocodeResponse,
  mockStores
} from '../../test-utils/mock-data'
import Leaflet from '../../test-utils/mock-leaflet'

import EditCommuter from '../../../client/containers/edit-commuter'

const commuterExpectations = makeGenericModelActionsExpectations({
  pluralName: 'commuters',
  singularName: 'commuter'
})

describe('Container > EditCommuter', () => {
  it('Create/Edit Commuter View loads (create or edit mode)', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)

    // mount component
    mount(
      <Provider store={mockStore}>
        <EditCommuter
          params={{groupId: 'group-2'}}
          />
      </Provider>
    , {
      attachTo: document.getElementById('test')
    })
  })

  it('Create/Edit Commuter View loads in create mode', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditCommuter
          params={{groupId: 'group-2'}}
          />
      </Provider>
    , {
      attachTo: document.getElementById('test')
    })

    expect(mountToJson(tree.find('.commuter-header'))).toMatchSnapshot()
    expect(mountToJson(tree.find('.commuter-form'))).toMatchSnapshot()
    expect(mountToJson(tree.find('.commuter-submit-buttons'))).toMatchSnapshot()

    // no marker should be added initially in create mode
    expect(Leaflet.marker).not.toBeCalled()
  })

  it('Create/Edit Commuter View loads in edit mode', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditCommuter
          params={{commuterId: 'commuter-2'}}
          />
      </Provider>
    , {
      attachTo: document.getElementById('test')
    })

    expect(mountToJson(tree.find('.commuter-header'))).toMatchSnapshot()
    expect(mountToJson(tree.find('.commuter-form'))).toMatchSnapshot()
    expect(mountToJson(tree.find('.commuter-submit-buttons'))).toMatchSnapshot()

    // marker should be added initially in edit mode
    expect(Leaflet.marker).toBeCalled()
    expect(Leaflet.marker.mock.calls[0][0]).toMatchSnapshot()
  })

  it('Create commuter', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditCommuter
          params={{groupId: 'group-2'}}
          />
      </Provider>
    , {
      attachTo: document.getElementById('test')
    })

    // give each text field some input
    // name
    tree.find('input').first().simulate('change', {target: {value: 'Mock Commuter'}})
    // email
    tree.find('input').at(1).simulate('change', {target: {value: 'mock@email.fake'}})
    // address
    tree.find('.form-group').find('Geocoder').props().onChange(mockGeocodeResponse)

    // submit form
    tree.find('.commuter-submit-buttons').find('button').first().simulate('click')

    // expect create action
    commuterExpectations.expectCreateAction({
      action: mockStore.getActions()[0],
      newEntity: genGeocodedEntity({
        email: 'mock@email.fake',
        groupId: 'group-2',
        name: 'Mock Commuter'
      })
    })
  })

  it('Update commuter', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditCommuter
          params={{commuterId: 'commuter-2'}}
          />
      </Provider>
    , {
      attachTo: document.getElementById('test')
    })

    // give each text field some input
    // name
    tree.find('input').first().simulate('change', {target: {value: 'Different Name'}})
    // email
    tree.find('input').at(1).simulate('change', {target: {value: 'different@email.fake'}})
    // address
    tree.find('.form-group').find('Geocoder').props().onChange(mockGeocodeResponse)

    // submit form
    tree.find('.commuter-submit-buttons').find('button').first().simulate('click')

    commuterExpectations.expectUpdateAction({
      action: mockStore.getActions()[0],
      entity: genGeocodedEntity({
        _id: 'commuter-2',
        email: 'different@email.fake',
        name: 'Different Name',
        groupId: 'group-2'
      })
    })
  })

  it('Delete Commuter', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)
    window.confirm = () => true

    // Given a logged-in user is viewing the Create/Edit Commuter View
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditCommuter
          params={{commuterId: 'commuter-2'}}
          />
      </Provider>
    , {
      attachTo: document.getElementById('test')
    })

    // clear all loading actions
    mockStore.clearActions()

    // When the user clicks the delete button
    // And the user confirms the Confirm Deletion dialog
    tree.find('.commuter-submit-buttons').find('button').last().simulate('click')

    commuterExpectations.expectDeleteAction({
      action: mockStore.getActions()[0],
      entity: mockCommuter
    })
  })
})
