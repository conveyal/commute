/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'
import {Provider} from 'react-redux'

import {makeGenericModelActionsExpectations} from '../../test-utils/actions'
import {timeoutPromise} from '../../test-utils/common'
import {
  genGeocodedEntity,
  makeMockStore,
  mockGeocodeResponse,
  mockSite,
  mockStores
} from '../../test-utils/mock-data'
import Leaflet from '../../test-utils/mock-leaflet'

import EditSite from '../../../client/containers/edit-site'

const siteExpectations = makeGenericModelActionsExpectations({
  pluralName: 'sites',
  singularName: 'site'
})

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

    // marker should be added initially in edit mode
    expect(Leaflet.marker).toBeCalled()
    expect(Leaflet.marker.mock.calls[0][0]).toMatchSnapshot()
  })

  it('Create site', async () => {
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
    tree.find('.form-group').find('Geocoder').props().onChange(mockGeocodeResponse)
    // radius
    tree.find('input').last().simulate('change', {target: {value: 0.5}})

    // submit form
    tree.find('form').find('button').first().simulate('click')

    // react-formal submit is asyncrhonous, so wait a bit
    await timeoutPromise(100)

    // expect create action
    siteExpectations.expectCreateAction({
      action: mockStore.getActions()[0],
      newEntity: genGeocodedEntity({
        name: 'Mock Site',
        organizationId: 'organization-1',
        radius: 0.5
      })
    })
  })

  it('Update site', async () => {
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
    tree.find('input').first().simulate('change', {target: {value: 'Different Name'}})
    // address
    tree.find('.form-group').find('Geocoder').props().onChange(mockGeocodeResponse)
    // radius
    tree.find('input').last().simulate('change', {target: {value: 1.5}})

    // submit form
    tree.find('form').find('button').first().simulate('click')

    // react-formal submit is asyncrhonous, so wait a bit
    await timeoutPromise(100)

    siteExpectations.expectUpdateAction({
      action: mockStore.getActions()[0],
      entity: genGeocodedEntity({
        _id: 'site-2',
        name: 'Different Name',
        organizationId: 'organization-2',
        radius: 1.5
      })
    })
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

    // clear all loading actions
    mockStore.clearActions()

    // When the user clicks the delete button
    // And the user confirms the Confirm Deletion dialog
    tree.find('form').find('button').last().simulate('click')

    siteExpectations.expectDeleteAction({
      action: mockStore.getActions()[0],
      entity: mockSite
    })
  })
})
