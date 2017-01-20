/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'

import BreadcrumbBar from '../../../client/components/breadcrumb-bar'
import {mockStores} from '../../test-utils/mock-data'

describe('Container > BreadcrumbBar', () => {
  const testCases = [
    '/',
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
