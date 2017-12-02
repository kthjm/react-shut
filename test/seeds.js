import assert from 'assert'
import sinon from 'sinon'
import {
  seedFromBottom,
  seedFromLeft,
  seedFromRight,
  seedFromTop
} from '../src/seeds'

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
      assert.equal(react.rootSize, undefined)
    }
  })

  describe(`react.rootSize === true`, () => {
    it(`fromBottom`, () => test(seedFromBottom))
    it(`fromLeft`, () => test(seedFromLeft))
    it(`fromRight`, () => test(seedFromRight))
    it(`fromTop`, () => test(seedFromTop))

    function test(seed) {
      const react = { rootSize: () => {} }
      const { rootSize } = react
      const { rootRef } = seed(react)
      rootRef({ clientWidth: 1000, clientHeight: 1000 })
      assert.deepStrictEqual(react.rootSize, rootSize)
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
      assert.ok(typeof react.rootSize === 'function')
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

describe(`onTouchMove`, () => {
  describe(`if(false)`, () => {
    const e = { touches: [{}] }

    describe(`if(!pre.state)`, () => {
      it(`fromBottom`, () => test(seedFromBottom))
      it(`fromLeft`, () => test(seedFromLeft))
      it(`fromRight`, () => test(seedFromRight))
      it(`fromTop`, () => test(seedFromTop))

      function test(seed) {
        const active = sinon.stub().returns(false)
        const notScroll = sinon.stub().returns(true)
        const react = { pre: { active, notScroll } }
        const { onTouchMove } = seed(react)
        onTouchMove(e)
        assert.ok(active.calledOnce)
        assert.ok(notScroll.notCalled)
      }
    })

    describe(`if(pre.notScroll(touch.pageY))`, () => {
      it(`fromLeft`, () => test(seedFromLeft))
      it(`fromRight`, () => test(seedFromRight))

      function test(seed) {
        const active = sinon.stub().returns(true)
        const notScroll = sinon.stub().returns(false)
        const react = { pre: { active, notScroll } }
        const { onTouchMove } = seed(react)
        const result = onTouchMove(e)
        assert.ok(active.calledOnce)
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
        pre: { active: () => true }
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

        const { onTouchMove } = seedFromBottom(react)
        onTouchMove(e)
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

        const { onTouchMove } = seedFromLeft(react)
        onTouchMove(e)
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

        const { onTouchMove } = seedFromRight(react)
        onTouchMove(e)
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

        const { onTouchMove } = seedFromTop(react)
        onTouchMove(e)
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
        pre: { active: () => true }
      })

      it(`fromBottom`, () => {
        const subtractValue = 501
        const react = React()
        react.pre.getY = () => subtractValue
        react.pre.setY = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        const { onTouchMove } = seedFromBottom(react)
        const result = onTouchMove(e)
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

        const { onTouchMove } = seedFromLeft(react)
        const result = onTouchMove(e)
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

        const { onTouchMove } = seedFromRight(react)
        const result = onTouchMove(e)
        assert.equal(result, false)
      })

      it(`fromTop`, () => {
        const subtractValue = 499
        const react = React()
        react.pre.getY = () => subtractValue
        react.pre.setY = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        const { onTouchMove } = seedFromTop(react)
        const result = onTouchMove(e)
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
        pre: { active: () => true }
      })

      it(`fromBottom`, () => {
        const subtractValue = 502
        const react = React()
        react.pre.getY = () => subtractValue
        react.pre.setY = () => {}
        react.pre.setSettle = () => {}
        react.pre.setNow = () => {}

        react.come = sinon.spy()
        const { onTouchMove } = seedFromBottom(react)
        onTouchMove(e)
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
        const { onTouchMove } = seedFromLeft(react)
        onTouchMove(e)
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
        const { onTouchMove } = seedFromRight(react)
        onTouchMove(e)
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
        const { onTouchMove } = seedFromTop(react)
        onTouchMove(e)
        assert.ok(react.come.calledOnce)
      })
    })
  })
})

describe(`onTouchEnd`, () => {
  describe(`(!pre.active())`, () => {
    it(`fromBottom`, () => test(seedFromBottom))
    it(`fromLeft`, () => test(seedFromLeft))
    it(`fromRight`, () => test(seedFromRight))
    it(`fromTop`, () => test(seedFromTop))

    function test(seed) {
      const { onTouchEnd } = seed({ pre: { active: () => false } })
      assert.equal(onTouchEnd(), undefined)
    }
  })

  describe(`Date.now() - pre.getNow() < 26 ? pre.getSettle()`, () => {
    it(`fromBottom`, () => test(seedFromBottom))
    it(`fromLeft`, () => test(seedFromLeft))
    it(`fromRight`, () => test(seedFromRight))
    it(`fromTop`, () => test(seedFromTop))

    function test(seed) {
      const settle = sinon.spy()
      const react = {
        pre: {
          getSettle: sinon.stub().returns(settle),
          kill: sinon.spy(),
          getNow: () => Date.now() + 1000,
          active: () => true
        }
      }

      const { onTouchEnd } = seed(react)
      onTouchEnd()
      assert.ok(react.pre.getSettle.calledOnce)
      assert.ok(settle.calledOnce)
      assert.ok(react.pre.kill.calledOnce)
    }
  })

  describe(`Date.now() - pre.getNow() < 26 : quitCondition() ? quit`, () => {
    it(`fromBottom`, () => test(seedFromBottom, 501))
    it(`fromLeft`, () => test(seedFromLeft, -501))
    it(`fromRight`, () => test(seedFromRight, 501))
    it(`fromTop`, () => test(seedFromTop, -501))

    function test(seed, value) {
      const react = {
        nowRootSize: 1000,
        props: { quitRatio: 0.5 },
        // reactionField === 500
        state: { value },
        pre: {
          kill: sinon.spy(),
          getNow: () => Date.now() - 27,
          active: () => true
        },
        quit: sinon.spy()
      }

      const { onTouchEnd } = seed(react)
      onTouchEnd()
      assert.ok(react.pre.kill.calledOnce)
      assert.ok(react.quit.calledOnce)
    }
  })

  describe(`Date.now() - pre.getNow() < 26 : quitCondition() : come`, () => {
    it(`fromBottom`, () => test(seedFromBottom, 500))
    it(`fromLeft`, () => test(seedFromLeft, -500))
    it(`fromRight`, () => test(seedFromRight, 500))
    it(`fromTop`, () => test(seedFromTop, -500))

    function test(seed, value) {
      const react = {
        nowRootSize: 1000,
        props: { quitRatio: 0.5 },
        // reactionField === 500
        state: { value },
        pre: {
          kill: sinon.spy(),
          getNow: () => Date.now() - 27,
          active: () => true
        },
        come: sinon.spy()
      }

      const { onTouchEnd } = seed(react)
      onTouchEnd()
      assert.ok(react.pre.kill.calledOnce)
      assert.ok(react.come.calledOnce)
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

  describe(`e.target === e.currentTarget: !onQuit`, () => {
    it(`fromBottom: onCome`, () => test(seedFromBottom))
    it(`fromLeft: onCome`, () => test(seedFromLeft))
    it(`fromRight: onCome`, () => test(seedFromRight))
    it(`fromTop: onCome`, () => test(seedFromTop))

    function test(seed, transform) {
      const onQuit = undefined
      const react = { props: { onQuit } }
      const { onTransitionEnd } = seed(react)

      const element = { style: { transform: 'translateZ(0px)' } }
      const e = { target: element, currentTarget: element }
      assert.equal(onTransitionEnd(e), undefined)
    }
  })

  describe(`e.target === e.currentTarget: !isFn(onQuit)`, () => {
    it(`fromBottom: onCome`, () => test(seedFromBottom))
    it(`fromLeft: onCome`, () => test(seedFromLeft))
    it(`fromRight: onCome`, () => test(seedFromRight))
    it(`fromTop: onCome`, () => test(seedFromTop))

    function test(seed, transform) {
      const onQuit = {}
      const react = { props: { onQuit } }
      const { onTransitionEnd } = seed(react)

      const element = { style: { transform: 'translateZ(0px)' } }
      const e = { target: element, currentTarget: element }
      assert.equal(onTransitionEnd(e), false)
    }
  })

  describe(`e.target === e.currentTarget: onCome`, () => {
    it(`fromBottom: onCome`, () => test(seedFromBottom, 'translateY(0px)'))
    it(`fromLeft: onCome`, () => test(seedFromLeft, 'translateX(0px)'))
    it(`fromRight: onCome`, () => test(seedFromRight, 'translateX(0px)'))
    it(`fromTop: onCome`, () => test(seedFromTop, 'translateY(0px)'))

    function test(seed, transform) {
      const onCome = sinon.stub()
      const react = { props: { onCome } }
      const { onTransitionEnd } = seed(react)

      const element = { style: { transform } }
      const e = { target: element, currentTarget: element }
      onTransitionEnd(e)
      assert.ok(onCome.calledOnce)
      assert.deepStrictEqual(onCome.args[0][0], e)
    }
  })
})
