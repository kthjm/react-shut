import React from 'react'
import Atra from 'atra'

//

var _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function(obj) {
        return typeof obj
      }
    : function(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj
      }

var classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

var inherits = function(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    )
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}

var possibleConstructorReturn = function(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }

  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self
}

//
var now = function now() {
  return Date.now()
}
var FORCE_DIFF = 26

var Pre = (function() {
  function Pre() {
    classCallCheck(this, Pre)
  }

  createClass(Pre, [
    {
      key: 'active',
      value: function active() {
        return Boolean(this.state) && _typeof(this.state) === 'object'
      }
    },
    {
      key: 'init',
      value: function init(touch) {
        this.state = {
          now: now(),
          x: touch.pageX,
          y: touch.pageY,
          doneCheckScroll: false,
          settle: undefined
        }
      }
    },
    {
      key: 'notScroll',
      value: function notScroll(compareY) {
        if (!this.state.doneCheckScroll) {
          var diffY = compareY - this.state.y
          if (diffY > 10 || diffY < -10) {
            return this.kill()
          }
          this.state.doneCheckScroll = true
        }
        return true
      }
    },
    {
      key: 'setX',
      value: function setX(x) {
        this.state.x = x
      }
    },
    {
      key: 'getX',
      value: function getX() {
        return this.state.x
      }
    },
    {
      key: 'setY',
      value: function setY(y) {
        this.state.y = y
      }
    },
    {
      key: 'getY',
      value: function getY() {
        return this.state.y
      }
    },
    {
      key: 'setSettle',
      value: function setSettle(f) {
        this.state.settle = f
      }
    },
    {
      key: 'getSettle',
      value: function getSettle() {
        var settle = this.state.settle

        return (
          now() - this.getNow() < FORCE_DIFF &&
          typeof settle === 'function' &&
          settle
        )
      }
    },
    {
      key: 'setNow',
      value: function setNow() {
        this.state.now = now()
      }
    },
    {
      key: 'getNow',
      value: function getNow() {
        return this.state.now
      }
    },
    {
      key: 'kill',
      value: function kill() {
        this.state = null
      }
    }
  ])
  return Pre
})()

//
var BACKGROUND = 'rgb(251, 251, 251)'
var DURATION = 0.4
var TOUCH_RATIO = 0.4
var QUIT_RATIO = 0.6

var winnerWidth = function winnerWidth() {
  return window.innerWidth
}
var winnerHeight = function winnerHeight() {
  return window.innerHeight
}
var isFn = function isFn(target) {
  return typeof target === 'function'
}

var createRootRef = function createRootRef(react, key) {
  return function(target) {
    if (target && !react.rootSize) {
      var rootSize = function rootSize() {
        return target[key]
      }
      react.rootSize = rootSize
    }
  }
}

var createOnTouchEnd = function createOnTouchEnd(react, quitCondition) {
  return function() {
    var pre = react.pre

    if (pre.active()) {
      var settle =
        pre.getSettle() || (quitCondition() ? react.quit : react.come)
      settle()
      pre.kill()
    }
  }
}

var createOnTransitionEnd = function createOnTransitionEnd(react, onComeKey) {
  return function(e) {
    e.currentTarget
    if (e.target === e.currentTarget) {
      var onCuit =
        e.currentTarget.style.transform === onComeKey
          ? react.props.onComeEnd
          : react.props.onQuitEnd

      return onCuit && isFn(onCuit) && onCuit(e)
    }
  }
}

//
var raf = function raf(fn) {
  return window.requestAnimationFrame(fn)
}

var createShut = function(seed) {
  return (function(_React$Component) {
    inherits(Shut, _React$Component)

    function Shut(props) {
      classCallCheck(this, Shut)

      var _this = possibleConstructorReturn(
        this,
        (Shut.__proto__ || Object.getPrototypeOf(Shut)).call(this, props)
      )

      var unique = seed(_this)

      // state
      _this.nowRootSize = unique.firstRootSize
      _this.state = { value: props.mountWithShut ? _this.nowRootSize : 0 }
      _this.pre = new Pre()

      // core
      _this.come = function() {
        return _this.setState({ value: 0 })
      }
      _this.quit = unique.quit
      _this.canInit = unique.canInit

      // a
      _this.a = A({
        ref: unique.rootRef,
        onTouchStart: function onTouchStart(_ref) {
          var touches = _ref.touches
          return _this.canInit(touches) && _this.pre.init(touches[0])
        },
        onTouchMove: unique.onTouchMove,
        onTouchEnd: unique.onTouchEnd,
        onTransitionEnd: unique.onTransitionEnd
      })

      // render
      _this.renders = {
        transform: unique.transform,
        transitionDuration: unique.transitionDuration,
        background: function background() {
          return _this.props.background || BACKGROUND
        },
        overflowY: function overflowY() {
          return !_this.props.notScroll && _this.state.value === 0
            ? 'scroll'
            : 'hidden'
        }
      }
      return _this
    }

    createClass(Shut, [
      {
        key: 'render',
        value: function render() {
          var a = this.a

          var transform = this.renders.transform()
          var transitionDuration = this.renders.transitionDuration()
          var background = this.renders.background()
          var overflowY = this.renders.overflowY()

          return React.createElement(
            'div',
            a('ROOT'),
            React.createElement(
              'div',
              a('MOVE', {
                style: {
                  transform: transform,
                  transitionDuration: transitionDuration,
                  background: background
                }
              }),
              React.createElement(
                'div',
                a('WRAP', { style: { overflowY: overflowY } }),
                this.props.children
              ),
              this.createQuit()
            )
          )
        }
      },
      {
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.nowRootSize = this.rootSize()
          return this.props.mountWithShut && raf(this.come)
        }
      },
      {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
          var rootSize = this.rootSize()
          if (rootSize !== this.nowRootSize) {
            this.nowRootSize = rootSize
          }
        }
      },
      {
        key: 'createQuit',
        value: function createQuit() {
          var Quit = this.props.Quit

          return (
            Quit && isFn(Quit) && React.createElement(Quit, { fn: this.quit })
          )
        }
      }
    ])
    return Shut
  })(React.Component)
}

var A = function A(_ref2) {
  var ref = _ref2.ref,
    onTouchStart = _ref2.onTouchStart,
    onTouchMove = _ref2.onTouchMove,
    onTouchEnd = _ref2.onTouchEnd,
    onTransitionEnd = _ref2.onTransitionEnd
  return Atra({
    ROOT: {
      ref: ref,
      onTouchStart: onTouchStart,
      onTouchMove: onTouchMove,
      onTouchEnd: onTouchEnd,
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden'
      }
    },
    MOVE: {
      onTransitionEnd: onTransitionEnd,
      style: {
        width: '100%',
        height: '100%',
        transitionProperty: 'transform'
      }
    },
    WRAP: {
      style: {
        height: '100%',
        overflowScrolling: 'touch',
        WebkitOverflowScrolling: 'touch'
      }
    }
  })
}

//
var seed = function seed(react) {
  return {
    firstRootSize: winnerHeight(),

    rootRef: createRootRef(react, 'clientHeight'),

    quit: function quit() {
      return react.setState({ value: react.nowRootSize })
    },

    canInit: function canInit(touches) {
      var touchRatio = react.props.touchRatio || TOUCH_RATIO
      var reactionField = winnerHeight() * touchRatio
      return touches.length === 1 && touches[0].pageY < reactionField
    },

    onTouchMove: function onTouchMove(_ref) {
      var touches = _ref.touches

      var touch = touches[0]
      var pre = react.pre

      if (pre.active()) {
        var nowY = react.state.value
        var diffY = touch.pageY - pre.getY()

        pre.setY(touch.pageY)
        pre.setSettle(diffY < 0 ? react.come : react.quit)
        pre.setNow()

        var nextY = nowY + diffY
        return nextY > 0
          ? react.setState({ value: nextY })
          : nowY !== 0 && react.come()
      }
    },

    onTouchEnd: createOnTouchEnd(react, function() {
      var nowRootSize = react.nowRootSize
      var value = react.state.value

      var quitRatio = react.props.quitRatio || QUIT_RATIO
      return value > nowRootSize * quitRatio
    }),

    onTransitionEnd: createOnTransitionEnd(react, 'translateY(0px)'),

    transform: function transform() {
      return 'translateY(' + react.state.value + 'px)'
    },

    transitionDuration: function transitionDuration() {
      return (
        (react.state.value === 0 || react.state.value === react.nowRootSize) &&
        (react.props.duration || DURATION) + 's'
      )
    }
  }
}

//
var seed$1 = function seed(react) {
  return {
    firstRootSize: -winnerWidth(),

    rootRef: createRootRef(react, 'clientWidth'),

    quit: function quit() {
      return react.setState({ value: -react.nowRootSize })
    },

    canInit: function canInit(touches) {
      var touchRatio = react.props.touchRatio || TOUCH_RATIO
      var reactionField = winnerWidth() * (1 - touchRatio)
      return touches.length === 1 && touches[0].pageX > reactionField
    },

    onTouchMove: function onTouchMove(_ref) {
      var touches = _ref.touches

      var touch = touches[0]
      var pre = react.pre

      if (pre.active() && pre.notScroll(touch.pageY)) {
        var nowX = react.state.value
        var diffX = touch.pageX - pre.getX()

        pre.setX(touch.pageX)
        pre.setSettle(diffX < 0 ? react.quit : react.come)
        pre.setNow()

        var nextX = nowX + diffX
        return nextX < 0
          ? react.setState({ value: nextX })
          : nowX !== 0 && react.come()
      }
    },

    onTouchEnd: createOnTouchEnd(react, function() {
      var nowRootSize = react.nowRootSize
      var value = react.state.value

      var quitRatio = react.props.quitRatio || QUIT_RATIO
      return value < -(nowRootSize * quitRatio)
    }),

    onTransitionEnd: createOnTransitionEnd(react, 'translateX(0px)'),

    transform: function transform() {
      return 'translateX(' + react.state.value + 'px)'
    },

    transitionDuration: function transitionDuration() {
      return (
        (react.state.value === 0 || react.state.value === -react.nowRootSize) &&
        (react.props.duration || DURATION) + 's'
      )
    }
  }
}

//
var seed$2 = function seed(react) {
  return {
    firstRootSize: winnerWidth(),

    rootRef: createRootRef(react, 'clientWidth'),

    quit: function quit() {
      return react.setState({ value: react.nowRootSize })
    },

    canInit: function canInit(touches) {
      var touchRatio = react.props.touchRatio || TOUCH_RATIO
      var reactionField = winnerWidth() * touchRatio
      return touches.length === 1 && touches[0].pageX < reactionField
    },

    onTouchMove: function onTouchMove(_ref) {
      var touches = _ref.touches

      var touch = touches[0]
      var pre = react.pre

      if (pre.active() && pre.notScroll(touch.pageY)) {
        var nowX = react.state.value
        var diffX = touch.pageX - pre.getX()

        pre.setX(touch.pageX)
        pre.setSettle(diffX < 0 ? react.come : react.quit)
        pre.setNow()

        var nextX = nowX + diffX
        return nextX > 0
          ? react.setState({ value: nextX })
          : nowX !== 0 && react.come()
      }
    },

    onTouchEnd: createOnTouchEnd(react, function() {
      var nowRootSize = react.nowRootSize
      var value = react.state.value

      var quitRatio = react.props.quitRatio || QUIT_RATIO
      return value > nowRootSize * quitRatio
    }),

    onTransitionEnd: createOnTransitionEnd(react, 'translateX(0px)'),

    transform: function transform() {
      return 'translateX(' + react.state.value + 'px)'
    },

    transitionDuration: function transitionDuration() {
      return (
        (react.state.value === 0 || react.state.value === react.nowRootSize) &&
        (react.props.duration || DURATION) + 's'
      )
    }
  }
}

//
var seed$3 = function seed(react) {
  return {
    firstRootSize: -winnerHeight(),

    rootRef: createRootRef(react, 'clientHeight'),

    quit: function quit() {
      return react.setState({ value: -react.nowRootSize })
    },

    canInit: function canInit(touches) {
      var touchRatio = react.props.touchRatio || TOUCH_RATIO
      var reactionField = winnerHeight() * (1 - touchRatio)
      return touches.length === 1 && touches[0].pageY > reactionField
    },

    onTouchMove: function onTouchMove(_ref) {
      var touches = _ref.touches

      var touch = touches[0]
      var pre = react.pre

      if (pre.active()) {
        var nowY = react.state.value
        var diffY = touch.pageY - pre.getY()

        pre.setY(touch.pageY)
        pre.setSettle(diffY < 0 ? react.quit : react.come)
        pre.setNow()

        var nextY = nowY + diffY
        return nextY < 0
          ? react.setState({ value: nextY })
          : nowY !== 0 && react.come()
      }
    },

    onTouchEnd: createOnTouchEnd(react, function() {
      var nowRootSize = react.nowRootSize
      var value = react.state.value

      var quitRatio = react.props.quitRatio || QUIT_RATIO
      return value < -(nowRootSize * quitRatio)
    }),

    onTransitionEnd: createOnTransitionEnd(react, 'translateY(0px)'),

    transform: function transform() {
      return 'translateY(' + react.state.value + 'px)'
    },

    transitionDuration: function transitionDuration() {
      return (
        (react.state.value === 0 || react.state.value === -react.nowRootSize) &&
        (react.props.duration || DURATION) + 's'
      )
    }
  }
}

var ShutFromBottom = createShut(seed)
var ShutFromLeft = createShut(seed$1)
var ShutFromRight = createShut(seed$2)
var ShutFromTop = createShut(seed$3)

export { ShutFromBottom, ShutFromLeft, ShutFromRight, ShutFromTop }
