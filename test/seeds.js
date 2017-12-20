import assert from 'assert'
import sinon from 'sinon'
import {
  seedFromBottom,
  seedFromLeft,
  seedFromRight,
  seedFromTop
} from '../src/seeds.js'

describe(`firstRootSize`, () => {
  const createReact = () => ({})

  it(`fromBottom`, () => {
    const react = createReact()
    const { firstRootSize } = seedFromBottom(react)
    assert.ok(firstRootSize > 0)
  })
  it(`fromLeft`, () => {
    const react = createReact()
    const { firstRootSize } = seedFromLeft(react)
    assert.ok(firstRootSize < 0)
  })
  it(`fromRight`, () => {
    const react = createReact()
    const { firstRootSize } = seedFromRight(react)
    assert.ok(firstRootSize > 0)
  })
  it(`fromTop`, () => {
    const react = createReact()
    const { firstRootSize } = seedFromTop(react)
    assert.ok(firstRootSize < 0)
  })
})

describe(`rootRef`, () => {
  describe(`!target`, () => {
    it(`fromBottom`, () => test(seedFromBottom))
    it(`fromLeft`, () => test(seedFromLeft))
    it(`fromRight`, () => test(seedFromRight))
    it(`fromTop`, () => test(seedFromTop))

    function test(seed) {
      const react = {}
      const { rootRef } = seed(react)
      const targets = [undefined, false, null]
      targets.forEach(target => rootRef(target))
      assert.equal(react.getRootSize, undefined)
    }
  })

  describe(`define`, () => {
    it(`fromBottom`, () => test(seedFromBottom))
    it(`fromLeft`, () => test(seedFromLeft))
    it(`fromRight`, () => test(seedFromRight))
    it(`fromTop`, () => test(seedFromTop))

    function test(seed) {
      const react = {}
      const { rootRef } = seed(react)
      rootRef({ clientWidth: 1000, clientHeight: 1000 })
      assert.ok(typeof react.getRootSize === 'function')
      assert.ok(typeof react.getRootWidth === 'function')
    }
  })
})

describe(`canInit`, () => {
  const windowInnerWidth = 1000
  const windowInnerHeight = 1000
  const touchRatio = 0.5
  // => reactionField === 500

  let currentInnerWidth, currentInnerHeight
  before(() => {
    currentInnerWidth = window.innerWidth
    currentInnerHeight = window.innerHeight
    window.innerWidth = windowInnerWidth
    window.innerHeight = windowInnerHeight
  })
  after(() => {
    window.innerWidth = currentInnerWidth
    window.innerHeight = currentInnerHeight
  })

  describe(`touches.length !== 1`, () => {
    it(`fromBottom`, () => test(seedFromBottom))
    it(`fromLeft`, () => test(seedFromLeft))
    it(`fromRight`, () => test(seedFromRight))
    it(`fromTop`, () => test(seedFromTop))

    function test(seed) {
      // set props.touchRatio as empty for use TOUCH_RATIO
      const react = { props: {} }

      const { canInit } = seedFromTop(react)
      const touches = [{}, {}]
      assert.equal(canInit(touches), false)
    }
  })

  describe(`second condition !== true`, () => {
    it(`fromBottom`, () => test(seedFromBottom, { pageY: 500 }))
    it(`fromLeft`, () => test(seedFromLeft, { pageX: 500 }))
    it(`fromRight`, () => test(seedFromRight, { pageX: 500 }))
    it(`fromTop`, () => test(seedFromTop, { pageY: 500 }))

    function test(seed, touch) {
      const react = { props: { touchRatio } }
      const { canInit } = seed(react)
      const touches = [touch]
      assert.equal(canInit(touches), false)
    }
  })

  describe(`return true`, () => {
    it(`fromBottom`, () => test(seedFromBottom, { pageY: 499 }))
    it(`fromLeft`, () => test(seedFromLeft, { pageX: 501 }))
    it(`fromRight`, () => test(seedFromRight, { pageX: 499 }))
    it(`fromTop`, () => test(seedFromTop, { pageY: 501 }))

    function test(seed, touch) {
      const react = { props: { touchRatio } }
      const { canInit } = seed(react)
      const touches = [touch]
      assert.equal(canInit(touches), true)
    }
  })
})

describe(`onTouchMoveCapture`, () => {
  describe(`if(false)`, () => {
    const e = { touches: [{}] }

    describe(`if(!pre.state)`, () => {
      it(`fromBottom`, () => test(seedFromBottom))
      it(`fromLeft`, () => test(seedFromLeft))
      it(`fromRight`, () => test(seedFromRight))
      it(`fromTop`, () => test(seedFromTop))

      function test(seed) {
        const canMove = sinon.stub().returns(false)
        const notScroll = sinon.stub().returns(true)
        const react = { pre: { canMove, notScroll } }
        const { onTouchMoveCapture } = seed(react)
        onTouchMoveCapture(e)
        assert.ok(canMove.calledOnce)
        assert.ok(notScroll.notCalled)
      }
    })

    describe(`if(pre.notScroll(touch.pageY))`, () => {
      it(`fromLeft`, () => test(seedFromLeft))
      it(`fromRight`, () => test(seedFromRight))

      function test(seed) {
        const canMove = sinon.stub().returns(true)
        const notScroll = sinon.stub().returns(false)
        const react = { pre: { canMove, notScroll } }
        const { onTouchMoveCapture } = seed(react)
        const result = onTouchMoveCapture(e)
        assert.ok(canMove.calledOnce)
        assert.ok(notScroll.calledOnce)
      }
    })
  })

  describe(`if(true)`, () => {
    describe(`return (nextValue > 0) ? => setState({ value: nextValue })`, () => {
      const pageX = 500
      const pageY = 500
      const e = { touches: [{ pageX, pageY }] }

      const value = 10
      const React = () => ({
        state: { value },
        pre: { canMove: () => true }
      })

      it(`fromBottom`, () => {
        const subtractValue = 509
        // diffY === -9 (pageY: 500 - subtractValue: 509)
        // nextY === 1 (value + diffY)
        // nextY > 0 => setState()

        const react = React()
        react.pre.getY = () => subtractValue
        react.pre.setY = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        react.setState = sinon.spy()

        const { onTouchMoveCapture } = seedFromBottom(react)
        onTouchMoveCapture(e)
        assert.ok(react.setState.calledOnce)
      })

      it(`fromLeft`, () => {
        const subtractValue = 511
        // diffX === -11 (pageY: 500 - subtractValue: 511)
        // nextX === -1 (value + diffY)
        // nextX < 0 => setState()

        const react = React()
        react.pre.notScroll = () => true
        react.pre.getX = () => subtractValue
        react.pre.setX = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        react.setState = sinon.spy()

        const { onTouchMoveCapture } = seedFromLeft(react)
        onTouchMoveCapture(e)
        assert.ok(react.setState.calledOnce)
      })

      it(`fromRight`, () => {
        const subtractValue = 509
        // diffX === -0 (pageY: 500 - subtractValue: 509)
        // nextX === 1 (value + diffY)
        // nextX > 0 => setState()

        const react = React()
        react.pre.notScroll = () => true
        react.pre.getX = () => subtractValue
        react.pre.setX = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        react.setState = sinon.spy()

        const { onTouchMoveCapture } = seedFromRight(react)
        onTouchMoveCapture(e)
        assert.ok(react.setState.calledOnce)
      })

      it(`fromTop`, () => {
        const subtractValue = 511
        // diffY === -11 (pageY: 500 - subtractValue: 511)
        // nextY === -1 (value + diffY)
        // nextY < 0 => setState()

        const react = React()
        react.pre.getY = () => subtractValue
        react.pre.setY = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        react.setState = sinon.spy()

        const { onTouchMoveCapture } = seedFromTop(react)
        onTouchMoveCapture(e)
        assert.ok(react.setState.calledOnce)
      })
    })

    describe(`return (nextValue > 0) : nowValue === 0 => false`, () => {
      const pageX = 500
      const pageY = 500
      const e = { touches: [{ pageX, pageY }] }

      const value = 0
      const React = () => ({
        state: { value },
        pre: { canMove: () => true }
      })

      it(`fromBottom`, () => {
        const subtractValue = 501
        const react = React()
        react.pre.getY = () => subtractValue
        react.pre.setY = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        const { onTouchMoveCapture } = seedFromBottom(react)
        const result = onTouchMoveCapture(e)
        assert.equal(result, false)
      })

      it(`fromLeft`, () => {
        const subtractValue = 499
        const react = React()
        react.pre.notScroll = () => true
        react.pre.getX = () => subtractValue
        react.pre.setX = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        const { onTouchMoveCapture } = seedFromLeft(react)
        const result = onTouchMoveCapture(e)
        assert.equal(result, false)
      })

      it(`fromRight`, () => {
        const subtractValue = 501
        const react = React()
        react.pre.notScroll = () => true
        react.pre.getX = () => subtractValue
        react.pre.setX = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        const { onTouchMoveCapture } = seedFromRight(react)
        const result = onTouchMoveCapture(e)
        assert.equal(result, false)
      })

      it(`fromTop`, () => {
        const subtractValue = 499
        const react = React()
        react.pre.getY = () => subtractValue
        react.pre.setY = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        const { onTouchMoveCapture } = seedFromTop(react)
        const result = onTouchMoveCapture(e)
        assert.equal(result, false)
      })
    })

    describe(`return (nextValue > 0) : nowValue !== 0 => come()`, () => {
      const pageX = 500
      const pageY = 500
      const e = { touches: [{ pageX, pageY }] }

      const value = 1
      const React = () => ({
        state: { value },
        pre: { canMove: () => true }
      })

      it(`fromBottom`, () => {
        const subtractValue = 502
        const react = React()
        react.pre.getY = () => subtractValue
        react.pre.setY = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        react.come = sinon.spy()
        const { onTouchMoveCapture } = seedFromBottom(react)
        onTouchMoveCapture(e)
        assert.ok(react.come.calledOnce)
      })

      it(`fromLeft`, () => {
        const subtractValue = 498
        const react = React()
        react.pre.notScroll = () => true
        react.pre.getX = () => subtractValue
        react.pre.setX = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        react.come = sinon.spy()
        const { onTouchMoveCapture } = seedFromLeft(react)
        onTouchMoveCapture(e)
        assert.ok(react.come.calledOnce)
      })

      it(`fromRight`, () => {
        const subtractValue = 502
        const react = React()
        react.pre.notScroll = () => true
        react.pre.getX = () => subtractValue
        react.pre.setX = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        react.come = sinon.spy()
        const { onTouchMoveCapture } = seedFromRight(react)
        onTouchMoveCapture(e)
        assert.ok(react.come.calledOnce)
      })

      it(`fromTop`, () => {
        const subtractValue = 498
        const react = React()
        react.pre.getY = () => subtractValue
        react.pre.setY = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        react.come = sinon.spy()
        const { onTouchMoveCapture } = seedFromTop(react)
        onTouchMoveCapture(e)
        assert.ok(react.come.calledOnce)
      })
    })
  })
})

describe(`onTouchEndCapture`, () => {
  const Pre = require('../src/Pre.js').default

  describe(`(!pre.canEnd())`, () => {
    it(`fromBottom`, () => test(seedFromBottom))
    it(`fromLeft`, () => test(seedFromLeft))
    it(`fromRight`, () => test(seedFromRight))
    it(`fromTop`, () => test(seedFromTop))

    function test(seed) {
      const pre = new Pre()
      sinon.stub(pre, 'canEnd').returns(false)
      const { onTouchEndCapture } = seed({ pre })
      assert.equal(onTouchEndCapture(), undefined)
      assert.ok(pre.canEnd.calledOnce)
    }
  })

  describe(`const settle = pre.getSettle()`, () => {
    it(`fromBottom`, () => test(seedFromBottom))
    it(`fromLeft`, () => test(seedFromLeft))
    it(`fromRight`, () => test(seedFromRight))
    it(`fromTop`, () => test(seedFromTop))

    function test(seed) {
      const pre = new Pre()
      sinon.stub(pre, 'canEnd').returns(true)
      sinon.stub(pre, 'getNow').returns(Date.now())
      sinon.spy(pre, 'kill')

      const settle = sinon.spy()
      pre.state = {}
      pre.setSettle(settle)

      const react = { pre }
      const { onTouchEndCapture } = seed(react)

      const stopPropagation = sinon.spy()
      const preventDefault = sinon.spy()
      onTouchEndCapture({ stopPropagation, preventDefault })

      assert.ok(stopPropagation.calledOnce)
      assert.ok(preventDefault.calledOnce)

      assert.ok(settle.calledOnce)
      assert.ok(pre.kill.calledOnce)
    }
  })

  describe(`const settle = !getSettle() && quitCondition() ? react.quit`, () => {
    it(`fromBottom`, () => test(seedFromBottom, 501))
    it(`fromLeft`, () => test(seedFromLeft, -501))
    it(`fromRight`, () => test(seedFromRight, 501))
    it(`fromTop`, () => test(seedFromTop, -501))

    function test(seed, value) {
      const pre = new Pre()
      sinon.stub(pre, 'canEnd').returns(true)
      sinon.stub(pre, 'getSettle').returns(false)
      sinon.spy(pre, 'kill')

      const react = {
        pre,
        // reactionField === 1000 * 0.5 => 500
        nowRootSize: 1000,
        props: { quitRatio: 0.5 },
        state: { value },
        quit: sinon.spy()
      }

      const { onTouchEndCapture } = seed(react)

      const stopPropagation = sinon.spy()
      const preventDefault = sinon.spy()
      onTouchEndCapture({ stopPropagation, preventDefault })

      assert.ok(stopPropagation.calledOnce)
      assert.ok(preventDefault.calledOnce)

      assert.ok(pre.getSettle.calledOnce)
      assert.ok(react.quit.calledOnce)
      assert.ok(pre.kill.calledOnce)
    }
  })

  describe(`const settle = !getSettle() && quitCondition() : react.come`, () => {
    it(`fromBottom`, () => test(seedFromBottom, 500))
    it(`fromLeft`, () => test(seedFromLeft, -500))
    it(`fromRight`, () => test(seedFromRight, 500))
    it(`fromTop`, () => test(seedFromTop, -500))

    function test(seed, value) {
      const pre = new Pre()
      sinon.stub(pre, 'canEnd').returns(true)
      sinon.stub(pre, 'getSettle').returns(false)
      sinon.spy(pre, 'kill')

      const react = {
        pre,
        // reactionField === 1000 * 0.5 => 500
        nowRootSize: 1000,
        props: { quitRatio: 0.5 },
        state: { value },
        come: sinon.spy()
      }

      const { onTouchEndCapture } = seed(react)

      const stopPropagation = sinon.spy()
      const preventDefault = sinon.spy()
      onTouchEndCapture({ stopPropagation, preventDefault })

      assert.ok(stopPropagation.calledOnce)
      assert.ok(preventDefault.calledOnce)

      assert.ok(pre.getSettle.calledOnce)
      assert.ok(react.come.calledOnce)
      assert.ok(pre.kill.calledOnce)
    }
  })
})

describe(`onTransitionEnd`, () => {
  describe(`e.target !== e.currentTarget`, () => {
    it(`fromBottom`, () => test(seedFromBottom))
    it(`fromLeft`, () => test(seedFromLeft))
    it(`fromRight`, () => test(seedFromRight))
    it(`fromTop`, () => test(seedFromTop))

    function test(seed) {
      const target = { nodeName: 'span' }
      const currentTarget = { nodeName: 'div' }
      const e = { target, currentTarget }
      const { onTransitionEnd } = seed()
      assert.equal(onTransitionEnd(e), undefined)
    }
  })

  describe(`e.target === e.currentTarget: !onQuitEnd`, () => {
    it(`fromBottom: onComeEnd`, () => test(seedFromBottom))
    it(`fromLeft: onComeEnd`, () => test(seedFromLeft))
    it(`fromRight: onComeEnd`, () => test(seedFromRight))
    it(`fromTop: onComeEnd`, () => test(seedFromTop))

    function test(seed, transform) {
      const onQuitEnd = undefined
      const react = { props: { onQuitEnd } }
      const { onTransitionEnd } = seed(react)

      const element = { style: { transform: 'translateZ(0px)' } }
      const e = { target: element, currentTarget: element }
      assert.equal(onTransitionEnd(e), undefined)
    }
  })

  describe(`e.target === e.currentTarget: !isFn(onQuitEnd)`, () => {
    it(`fromBottom: onComeEnd`, () => test(seedFromBottom))
    it(`fromLeft: onComeEnd`, () => test(seedFromLeft))
    it(`fromRight: onComeEnd`, () => test(seedFromRight))
    it(`fromTop: onComeEnd`, () => test(seedFromTop))

    function test(seed, transform) {
      const onQuitEnd = {}
      const react = { props: { onQuitEnd } }
      const { onTransitionEnd } = seed(react)

      const element = { style: { transform: 'translateZ(0px)' } }
      const e = { target: element, currentTarget: element }
      assert.equal(onTransitionEnd(e), undefined)
    }
  })

  describe(`e.target === e.currentTarget: onComeEnd`, () => {
    it(`fromBottom: onComeEnd`, () => test(seedFromBottom, 'translateY(0px)'))
    it(`fromLeft: onComeEnd`, () => test(seedFromLeft, 'translateX(0px)'))
    it(`fromRight: onComeEnd`, () => test(seedFromRight, 'translateX(0px)'))
    it(`fromTop: onComeEnd`, () => test(seedFromTop, 'translateY(0px)'))

    function test(seed, transform) {
      const onComeEnd = sinon.stub()
      const react = { props: { onComeEnd } }
      const { onTransitionEnd } = seed(react)

      const element = { style: { transform } }
      const e = { target: element, currentTarget: element }
      onTransitionEnd(e)
      assert.ok(onComeEnd.calledOnce)
      assert.deepStrictEqual(onComeEnd.args[0][0], e)
    }
  })
})
