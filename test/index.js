import assert from 'assert'
import sinon from 'sinon'
import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import enzyme from 'enzyme'
enzyme.configure({ adapter: new Adapter() })

describe(`components`, () => {
  const components = require('../src')

  it(`instance`, () => {
    const currentRaf = window.requestAnimationFrame
    const raf = sinon.spy()
    window.requestAnimationFrame = raf

    return all({}, wrapper => {
      const instance = wrapper.instance()

      // this.renderValues
      const { renderValues } = instance
      const results = renderValues()
      assert.ok(Object.keys(results).length === 4)
      assert.ok(typeof results.transform === 'string')
      assert.ok(typeof results.transitionDuration === 'string')
      assert.ok(typeof results.background === 'string')
      assert.ok(typeof results.overflowY === 'string')

      // this.a
      const { a } = instance

      const ROOT = a('ROOT')
      assert.ok(Object.keys(ROOT).length === 5)
      assert.ok(typeof ROOT.ref === 'function')
      assert.ok(typeof ROOT.onTouchStartCapture === 'function')
      assert.ok(typeof ROOT.onTouchMoveCapture === 'function')
      assert.ok(typeof ROOT.onTouchEndCapture === 'function')
      assert.deepEqual(ROOT.style, {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden'
      })

      const MOVE = a('MOVE')
      assert.ok(Object.keys(MOVE).length === 2)
      assert.ok(typeof MOVE.onTransitionEnd === 'function')
      assert.deepEqual(MOVE.style, {
        width: '100%',
        height: '100%',
        transitionProperty: '-webkit-transform,transform',
        MozTransitionProperty: 'transform',
        WebkitTransitionProperty: '-webkit-transform,transform'
      })

      const WRAP = a('WRAP')
      assert.ok(Object.keys(WRAP).length === 1)
      assert.deepEqual(WRAP.style, {
        height: '100%',
        overflowScrolling: 'touch',
        WebkitOverflowScrolling: 'touch'
      })
    }).then(() => {
      window.requestAnimationFrame = currentRaf
    })
  })

  it(`props: { mountWithShut }`, () => {
    const currentRaf = window.requestAnimationFrame
    const raf = sinon.spy()
    window.requestAnimationFrame = raf

    return all({ mountWithShut: true }).then(() => {
      assert.equal(raf.callCount, 4)
      assert.ok(typeof raf.args[0][0] === 'function')
      assert.ok(typeof raf.args[1][0] === 'function')
      assert.ok(typeof raf.args[2][0] === 'function')
      assert.ok(typeof raf.args[3][0] === 'function')

      window.requestAnimationFrame = currentRaf
    })
  })

  it(`!props.scroll`, () => {
    const currentRaf = window.requestAnimationFrame
    const raf = sinon.spy()
    window.requestAnimationFrame = raf

    return all({ notScroll: true }, wrapper =>
      assert.equal(wrapper.instance().renderValues().overflowY, 'hidden')
    ).then(() => {
      window.requestAnimationFrame = currentRaf
    })
  })

  function all(props, cb) {
    return Promise.all(
      Object.values(components).map(Component => {
        const wrapper = enzyme.mount(<Component {...props} />)
        return typeof cb === 'function' && cb(wrapper)
      })
    )
  }
})

describe(`Pre.js`, () => {
  const Pre = require('../src/Pre.js').default
  const touch = { pageX: 100, pageY: 100 }

  it(`x`, () => {
    const pre = new Pre()
    pre.init(touch)
    assert.equal(pre.getX(), 100)
    pre.setX(200)
    assert.equal(pre.getX(), 200)
  })

  it(`y`, () => {
    const pre = new Pre()
    pre.init(touch)
    assert.equal(pre.getY(), 100)
    pre.setY(200)
    assert.equal(pre.getY(), 200)
  })

  it(`settle`, () => {
    const pre = new Pre()
    pre.init(touch)
    assert.equal(pre.getSettle(), false)
    const settle = () => {}
    pre.setSettle(settle)
    assert.equal(pre.getSettle(), settle)
  })

  it(`now`, () => {
    const pre = new Pre()
    pre.init(touch)
    const now1 = pre.getNow()
    return lag(500).then(() => {
      pre.setNow()
      assert.ok(now1 < pre.getNow())
    })
  })

  it(`kill`, () => {
    const pre = new Pre()
    pre.init(touch)
    assert.equal(pre.canMove(), true)
    pre.kill()
    assert.equal(pre.canMove(), false)
  })

  describe(`notScroll`, () => {
    // const diffY = compareY - this.state.y

    it(`this.state.doneCheckScroll === true`, () => {
      const pre = new Pre()
      pre.init(touch)
      pre.state.doneCheckScroll = true
      assert.ok(pre.notScroll())
    })

    it(`diffY > 10`, () => {
      const compareY = 111
      const pre = new Pre()
      pre.init(touch)
      assert.ok(!pre.notScroll(compareY))
    })

    it(`diffY < -10`, () => {
      const compareY = 89
      const pre = new Pre()
      pre.init(touch)
      assert.ok(!pre.notScroll(compareY))
    })

    it(`!(diffY > 10) && !(diffY < -10)`, () => {
      const compareY = 109
      const pre = new Pre()
      pre.init(touch)
      assert.ok(pre.notScroll(compareY))
    })
  })
})

function lag(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}
