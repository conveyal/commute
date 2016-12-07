/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'

import BreadcrumbBar from '../../../client/components/breadcrumb-bar'
import {mockStores} from '../../test-utils/mock-data'

describe('Container > BreadcrumbBar', () => {
  const testCases = [
    '/',
    '/agency/create',
    '/agency/agency-2',
    '/agency/agency-2/edit',
    '/agency/agency-2/organization/create',
    '/organization/organization-2',
    '/organization/organization-2/edit',
    '/organization/organization-2/analysis/create',
    '/analysis/analysis-2',
    '/analysis/analysis-2/histogram',
    '/analysis/analysis-2/possibilities',
    '/analysis/analysis-2/individuals',
    '/organization/organization-2/group/create',
    '/group/group-2',
    '/group/group-2/add',
    '/group/group-2/commuter/create',
    '/commuter/commuter-2/edit',
    '/organization/organization-2/site/create',
    '/site/site-2/edit'
  ]

  testCases.forEach((testPath) => {
    it(`renders correctly for "${testPath}"`, () => {
      window.fakePath = testPath

      // mount component
      const tree = mount(
        <BreadcrumbBar
          {...mockStores.withAnalysisRun}
          />
      )
      expect(mountToJson(tree.find('ol'))).toMatchSnapshot()
    })
  })
})
