/* global describe, expect, it */

import {mount} from 'enzyme'
import {mountToJson} from 'enzyme-to-json'
import React from 'react'

import Footer from '../../../client/components/footer'

describe('Container > Footer', () => {
  it('renders correctly', () => {
    // mount component
    const tree = mount(
      <Footer />
    )
    expect(mountToJson(tree)).toMatchSnapshot()
  })
})
