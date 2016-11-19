/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {expectCreateSite, expectDeleteSite, expectUpdateAction} from '../../test-utils/actions'
import {makeMockStore, mockStores} from '../../test-utils/mock-data'
import Leaflet from '../../test-utils/mock-leaflet'

import EditSite from '../../../client/containers/edit-site'

describe('Container > EditSite', () => {
  it('Create/Edit Site View loads (create or edit mode)', () => {
    const mockStore = makeMockStore(mockStores.withBlankOrganization)

    // mount component
    mount(
      <Provider store={mockStore}>
        <EditSite
          params={{organizationId: 'organization-1'}}
          />
      </Provider>
    , {
      attachTo: document.getElementById('test')
    })
  })

  it('Create/Edit Site View loads in create mode', () => {
    const mockStore = makeMockStore(mockStores.withBlankOrganization)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditSite
          params={{organizationId: 'organization-1'}}
          />
      </Provider>
    , {
      attachTo: document.getElementById('test')
    })

    expect(mountToJson(tree.find('.site-header'))).toMatchSnapshot()
    expect(mountToJson(tree.find('.site-form'))).toMatchSnapshot()
    expect(mountToJson(tree.find('.site-submit-buttons'))).toMatchSnapshot()

    // no marker should be added initially in create mode
    expect(Leaflet.marker).not.toBeCalled()
  })

  it('Create/Edit Site View loads in edit mode', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditSite
          params={{siteId: 'site-2'}}
          />
      </Provider>
    , {
      attachTo: document.getElementById('test')
    })

    expect(mountToJson(tree.find('.site-header'))).toMatchSnapshot()
    expect(mountToJson(tree.find('.site-form'))).toMatchSnapshot()
    expect(mountToJson(tree.find('.site-submit-buttons'))).toMatchSnapshot()

    // marker should be added initially in edit mode
    expect(Leaflet.marker).toBeCalled()
    expect(Leaflet.marker.mock.calls[0][0]).toMatchSnapshot()
  })

  it('Create site', () => {
    const mockStore = makeMockStore(mockStores.withBlankOrganization)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditSite
          params={{organizationId: 'organization-1'}}
          />
      </Provider>
    , {
      attachTo: document.getElementById('test')
    })

    // give each text field some input
    // name
    tree.find('input').first().simulate('change', {target: {value: 'Mock Site'}})
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
    // radius
    tree.find('input').last().simulate('change', {target: {value: 0.5}})

    // submit form
    tree.find('.site-submit-buttons').find('button').first().simulate('click')

    // expect create action
    expectCreateSite(mockStore.getActions())
  })

  it('Update site', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)

    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditSite
          params={{siteId: 'site-2'}}
          />
      </Provider>
    , {
      attachTo: document.getElementById('test')
    })

    // give each text field some input
    // name
    tree.find('input').first().simulate('change', {target: {value: 'Mock Site'}})
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
    // radius
    tree.find('input').last().simulate('change', {target: {value: 0.5}})

    // submit form
    tree.find('.site-submit-buttons').find('button').first().simulate('click')

    expectUpdateAction(mockStore.getActions())
  })

  it('Delete Site', () => {
    const mockStore = makeMockStore(mockStores.withAnalysisRun)
    window.confirm = () => true

    // Given a logged-in user is viewing the Create/Edit Site View
    // mount component
    const tree = mount(
      <Provider store={mockStore}>
        <EditSite
          params={{siteId: 'site-2'}}
          />
      </Provider>
    , {
      attachTo: document.getElementById('test')
    })

    // When the user clicks the delete button
    // And the user confirms the Confirm Deletion dialog
    tree.find('.site-submit-buttons').find('button').last().simulate('click')

    expectDeleteSite(mockStore.getActions())
  })
})
