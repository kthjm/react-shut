import assert from 'assert'
import sinon from 'sinon'
import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import enzyme from 'enzyme'
enzyme.configure({ adapter: new Adapter() })

import {
  ShutFromRight,
  ShutFromLeft,
  ShutFromBottom,
  ShutFromTop
} from '../src'

describe(`index.js`, () => {
  global.requestAnimationFrame = () => {}

  it(`nothing`, () => mount({}))
  it(`with background`, () => mount({ background: 'red' }))
  it(`with duration`, () => mount({ background: '3s' }))
  it(`with mountWithShut`, () => mount({ mountWithShut: true }))
  it(`with touchRatio`, () => mount({ touchRatio: 0.5 }))
  it(`with quitRatio`, () => mount({ quitRatio: 0.8 }))
  it(`with Quit`, () => mount({ Quit: () => <div /> }))

  function mount(props) {
    enzyme.mount(<ShutFromRight {...props} />)
    enzyme.mount(<ShutFromLeft {...props} />)
    enzyme.mount(<ShutFromBottom {...props} />)
    enzyme.mount(<ShutFromTop {...props} />)
  }
})

describe(`Pre.js`, () => {})

describe(`util.js`, () => {})
