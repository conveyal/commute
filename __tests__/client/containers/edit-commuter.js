/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {expectCreateCommuter, expectDeleteCommuter, expectUpdateAction} from '../../test-utils/actions'
import {makeMockStore, mockStores} from '../../test-utils/mock-data'
import Leaflet from '../../test-utils/mock-leaflet'

import EditCommuter from '../../../client/containers/edit-commuter'

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
    tree.find('.form-group').find('Geocoder').props().onChange({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          -76.9897,
          38.89011
        ]
      },
      properties: {
        label: 'Abraham Lincoln/Emancipation Monument, Washington, USA'
      }
    })

    // submit form
    tree.find('.commuter-submit-buttons').find('button').first().simulate('click')

    // expect create action
    expectCreateCommuter(mockStore.getActions())
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
    tree.find('input').first().simulate('change', {target: {value: 'Mock Commuter'}})
    // email
    tree.find('input').at(1).simulate('change', {target: {value: 'mock@email.fake'}})
    // address
    tree.find('.form-group').find('Geocoder').props().onChange({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          -76.9897,
          38.89011
        ]
      },
      properties: {
        label: 'Abraham Lincoln/Emancipation Monument, Washington, USA'
      }
    })

    // submit form
    tree.find('.commuter-submit-buttons').find('button').first().simulate('click')

    expectUpdateAction(mockStore.getActions())
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

    // When the user clicks the delete button
    // And the user confirms the Confirm Deletion dialog
    tree.find('.commuter-submit-buttons').find('button').last().simulate('click')

    expectDeleteCommuter(mockStore.getActions())
  })
})
