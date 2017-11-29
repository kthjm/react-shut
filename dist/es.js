import React from 'react'
import Atra from 'atra'

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

var Pre = (function() {
  function Pre() {
    classCallCheck(this, Pre)

    this.active = false
  }

  createClass(Pre, [
    {
      key: 'init',
      value: function init(touch) {
        this.state = {
          now: Date.now(),
          x: touch.pageX,
          y: touch.pageY,
          doneCheckScroll: false,
          settle: undefined
        }

        this.active = true
      }
    },
    {
      key: 'isScroll',
      value: function isScroll(compareY) {
        if (!this.state.doneCheckScroll) {
          var diffY = compareY - this.state.y

          if (diffY > 10 || diffY < -10) {
            this.kill()
            return true
          } else {
            this.state.doneCheckScroll = true
          }
        }
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
        return this.state.settle
      }
    },
    {
      key: 'setNow',
      value: function setNow() {
        this.state.now = Date.now()
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
        this.active = false
      }
    }
  ])
  return Pre
})()

//

var DURATION = '0.4s'
var BACKGROUND = 'rgb(251, 251, 251)'
var TOUCH_RATIO = 0.4
var QUIT_RAIO = 0.6

var lag = function lag() {
  var time =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0
  return new Promise(function(resolve) {
    return setTimeout(resolve, time)
  })
}

var isFn = function isFn(target) {
  return typeof target === 'function'
}

var RootRef = function RootRef(react, key) {
  return function(target) {
    if (target && !react.rootSize) {
      react.rootSize = function() {
        return target[key]
      }
    }
  }
}

var OnTransitionEnd = function OnTransitionEnd(react, onComeKey) {
  return function(e) {
    if (e.target === e.currentTarget) {
      var onCuit =
        e.currentTarget.style.transform === onComeKey
          ? react.props.onCome
          : react.props.onQuit

      return isFn(onCuit) && onCuit(e)
    }
  }
}

//
var ShutFromRight = (function(_React$Component) {
  inherits(ShutFromRight, _React$Component)
  createClass(ShutFromRight, [
    {
      key: 'come',
      value: function come() {
        this.setState({ x: 0 })
      }
    },
    {
      key: 'quit',
      value: function quit() {
        this.setState({ x: this.nowRootSize })
      }
    },
    {
      key: 'canInit',
      value: function canInit(touches) {
        var touchRatio = this.props.touchRatio || TOUCH_RATIO
        var reactionField = window.innerWidth * touchRatio
        return touches.length === 1 && touches[0].pageX < reactionField
      }
    }
  ])

  function ShutFromRight(props) {
    classCallCheck(this, ShutFromRight)

    var _this = possibleConstructorReturn(
      this,
      (ShutFromRight.__proto__ || Object.getPrototypeOf(ShutFromRight)).call(
        this,
        props
      )
    )

    _this.nowRootSize = window.innerWidth
    _this.state = { x: props.mountWithShut ? _this.nowRootSize : 0 }
    _this.pre = new Pre()
    _this.rootRef = RootRef(_this, 'clientWidth')
    _this.come = _this.come.bind(_this)
    _this.quit = _this.quit.bind(_this)
    return _this
  }

  createClass(ShutFromRight, [
    {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this

        this.listeners = {}

        this.listeners.onTouchStart = function(_ref) {
          var touches = _ref.touches
          return _this2.canInit(touches) && _this2.pre.init(touches[0])
        }

        this.listeners.onTouchMove = function(_ref2) {
          var touches = _ref2.touches

          var touch = touches[0]
          var pre = _this2.pre

          if (pre.active && !pre.isScroll(touch.pageY)) {
            var nowX = _this2.state.x
            var diffX = touch.pageX - pre.getX()

            pre.setX(touch.pageX)
            pre.setSettle(diffX < 0 ? _this2.come : _this2.quit)
            pre.setNow()

            var nextX = nowX + diffX
            return nextX > 0
              ? _this2.setState({ x: nextX })
              : nowX !== 0 && _this2.come()
          }
        }

        this.listeners.onTouchEnd = function() {
          if (_this2.pre.active) {
            var pre = _this2.pre,
              nowRootSize = _this2.nowRootSize
            var quitRatio = _this2.props.quitRatio
            var x = _this2.state.x

            var settle =
              Date.now() - pre.getNow() < 26
                ? pre.getSettle()
                : x > nowRootSize * (quitRatio || QUIT_RAIO)
                  ? _this2.quit
                  : _this2.come

            settle()
            pre.kill()
          }
        }

        this.listeners.onTransitionEnd = OnTransitionEnd(
          this,
          'translateX(0px)'
        )
      }
    },
    {
      key: 'render',
      value: function render() {
        var _listeners = this.listeners,
          onTouchStart = _listeners.onTouchStart,
          onTouchMove = _listeners.onTouchMove,
          onTouchEnd = _listeners.onTouchEnd,
          onTransitionEnd = _listeners.onTransitionEnd

        var ref = this.rootRef
        var nowRootSize = this.nowRootSize
        var x = this.state.x
        var _props = this.props,
          duration = _props.duration,
          background = _props.background,
          children = _props.children

        return React.createElement(
          'div',
          a('ROOT', {
            ref: ref,
            onTouchStart: onTouchStart,
            onTouchMove: onTouchMove,
            onTouchEnd: onTouchEnd
          }),
          React.createElement(
            'div',
            a('MOVE', {
              onTransitionEnd: onTransitionEnd,
              style: {
                background: background || BACKGROUND,
                transform: 'translateX(' + x + 'px)',
                transitionDuration:
                  (x === 0 || x === nowRootSize) && (duration || DURATION)
              }
            }),
            React.createElement(
              'div',
              a('WRAP', {
                style: { overflowY: x === 0 ? 'scroll' : 'hidden' }
              }),
              children
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
        return this.props.mountWithShut && lag().then(this.come)
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

        return isFn(Quit) && React.createElement(Quit, { fn: this.quit })
      }
    }
  ])
  return ShutFromRight
})(React.Component)

var a = Atra({
  ROOT: {
    style: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  },
  MOVE: {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      transitionProperty: 'transform'
    }
  },
  WRAP: {
    style: {
      height: '100%',
      overflowScrolling: 'touch'
      // WebkitOverflowScrolling: 'touch',
    }
  }
})

//
var ShutFromLeft = (function(_React$Component) {
  inherits(ShutFromLeft, _React$Component)
  createClass(ShutFromLeft, [
    {
      key: 'come',
      value: function come() {
        this.setState({ x: 0 })
      }
    },
    {
      key: 'quit',
      value: function quit() {
        this.setState({ x: -this.nowRootSize })
      }
    },
    {
      key: 'canInit',
      value: function canInit(touches) {
        var touchRatio = this.props.touchRatio || TOUCH_RATIO
        var reactionField = window.innerWidth * (1 - touchRatio)
        return touches.length === 1 && touches[0].pageX > reactionField
      }
    }
  ])

  function ShutFromLeft(props) {
    classCallCheck(this, ShutFromLeft)

    var _this = possibleConstructorReturn(
      this,
      (ShutFromLeft.__proto__ || Object.getPrototypeOf(ShutFromLeft)).call(
        this,
        props
      )
    )

    _this.nowRootSize = window.innerWidth
    _this.state = { x: props.mountWithShut ? -_this.nowRootSize : 0 }
    _this.pre = new Pre()
    _this.rootRef = RootRef(_this, 'clientWidth')
    _this.come = _this.come.bind(_this)
    _this.quit = _this.quit.bind(_this)
    return _this
  }

  createClass(ShutFromLeft, [
    {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this

        this.listeners = {}

        this.listeners.onTouchStart = function(_ref) {
          var touches = _ref.touches
          return _this2.canInit(touches) && _this2.pre.init(touches[0])
        }

        this.listeners.onTouchMove = function(_ref2) {
          var touches = _ref2.touches

          var touch = touches[0]
          var pre = _this2.pre

          if (pre.active && !pre.isScroll(touch.pageY)) {
            var nowX = _this2.state.x
            var diffX = touch.pageX - pre.getX()

            pre.setX(touch.pageX)
            pre.setSettle(diffX < 0 ? _this2.quit : _this2.come)
            pre.setNow()

            var nextX = nowX + diffX
            return nextX < 0
              ? _this2.setState({ x: nextX })
              : nowX !== 0 && _this2.come()
          }
        }

        this.listeners.onTouchEnd = function() {
          if (_this2.pre.active) {
            var pre = _this2.pre,
              nowRootSize = _this2.nowRootSize
            var quitRatio = _this2.props.quitRatio
            var x = _this2.state.x

            var settle =
              Date.now() - pre.getNow() < 26
                ? pre.getSettle()
                : x < -(nowRootSize * (quitRatio || QUIT_RAIO))
                  ? _this2.quit
                  : _this2.come

            settle()
            pre.kill()
          }
        }

        this.listeners.onTransitionEnd = OnTransitionEnd(
          this,
          'translateX(0px)'
        )
      }
    },
    {
      key: 'render',
      value: function render() {
        var _listeners = this.listeners,
          onTouchStart = _listeners.onTouchStart,
          onTouchMove = _listeners.onTouchMove,
          onTouchEnd = _listeners.onTouchEnd,
          onTransitionEnd = _listeners.onTransitionEnd

        var ref = this.rootRef
        var nowRootSize = this.nowRootSize
        var x = this.state.x
        var _props = this.props,
          duration = _props.duration,
          background = _props.background,
          children = _props.children

        return React.createElement(
          'div',
          a$1('ROOT', {
            ref: ref,
            onTouchStart: onTouchStart,
            onTouchMove: onTouchMove,
            onTouchEnd: onTouchEnd
          }),
          React.createElement(
            'div',
            a$1('MOVE', {
              onTransitionEnd: onTransitionEnd,
              style: {
                background: background || BACKGROUND,
                transform: 'translateX(' + x + 'px)',
                transitionDuration:
                  (x === 0 || x === -nowRootSize) && (duration || DURATION)
              }
            }),
            React.createElement(
              'div',
              a$1('WRAP', {
                style: { overflowY: x === 0 ? 'scroll' : 'hidden' }
              }),
              children
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
        return this.props.mountWithShut && lag().then(this.come)
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

        return isFn(Quit) && React.createElement(Quit, { fn: this.quit })
      }
    }
  ])
  return ShutFromLeft
})(React.Component)

var a$1 = Atra({
  ROOT: {
    style: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  },
  MOVE: {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      transitionProperty: 'transform'
    }
  },
  WRAP: {
    style: {
      height: '100%',
      overflowScrolling: 'touch'
      // WebkitOverflowScrolling: 'touch',
    }
  }
})

//
var ShutFromBottom = (function(_React$Component) {
  inherits(ShutFromBottom, _React$Component)
  createClass(ShutFromBottom, [
    {
      key: 'come',
      value: function come() {
        this.setState({ y: 0 })
      }
    },
    {
      key: 'quit',
      value: function quit() {
        this.setState({ y: this.nowRootSize })
      }
    },
    {
      key: 'canInit',
      value: function canInit(touches) {
        var touchRatio = this.props.touchRatio || TOUCH_RATIO
        var reactionField = window.innerHeight * touchRatio
        return touches.length === 1 && touches[0].pageY < reactionField
      }
    }
  ])

  function ShutFromBottom(props) {
    classCallCheck(this, ShutFromBottom)

    var _this = possibleConstructorReturn(
      this,
      (ShutFromBottom.__proto__ || Object.getPrototypeOf(ShutFromBottom)).call(
        this,
        props
      )
    )

    _this.nowRootSize = window.innerHeight
    _this.state = { y: props.mountWithShut ? _this.nowRootSize : 0 }
    _this.pre = new Pre()
    _this.rootRef = RootRef(_this, 'clientHeight')
    _this.come = _this.come.bind(_this)
    _this.quit = _this.quit.bind(_this)
    return _this
  }

  createClass(ShutFromBottom, [
    {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this

        this.listeners = {}

        this.listeners.onTouchStart = function(_ref) {
          var touches = _ref.touches
          return _this2.canInit(touches) && _this2.pre.init(touches[0])
        }

        this.listeners.onTouchMove = function(_ref2) {
          var touches = _ref2.touches

          var touch = touches[0]
          var pre = _this2.pre

          if (pre.active) {
            var nowY = _this2.state.y
            var diffY = touch.pageY - pre.getY()

            pre.setY(touch.pageY)
            pre.setSettle(diffY < 0 ? _this2.come : _this2.quit)
            pre.setNow()

            var nextY = nowY + diffY
            return nextY > 0
              ? _this2.setState({ y: nextY })
              : nowY !== 0 && _this2.come()
          }
        }

        this.listeners.onTouchEnd = function() {
          if (_this2.pre.active) {
            var pre = _this2.pre,
              nowRootSize = _this2.nowRootSize
            var quitRatio = _this2.props.quitRatio
            var y = _this2.state.y

            var settle =
              Date.now() - pre.getNow() < 26
                ? pre.getSettle()
                : y > nowRootSize * (quitRatio || QUIT_RAIO)
                  ? _this2.quit
                  : _this2.come

            settle()
            pre.kill()
          }
        }

        this.listeners.onTransitionEnd = OnTransitionEnd(
          this,
          'translateY(0px)'
        )
      }
    },
    {
      key: 'render',
      value: function render() {
        var _listeners = this.listeners,
          onTouchStart = _listeners.onTouchStart,
          onTouchMove = _listeners.onTouchMove,
          onTouchEnd = _listeners.onTouchEnd,
          onTransitionEnd = _listeners.onTransitionEnd

        var ref = this.rootRef
        var nowRootSize = this.nowRootSize
        var y = this.state.y
        var _props = this.props,
          duration = _props.duration,
          background = _props.background,
          children = _props.children

        return React.createElement(
          'div',
          a$2('ROOT', {
            ref: ref,
            onTouchStart: onTouchStart,
            onTouchMove: onTouchMove,
            onTouchEnd: onTouchEnd
          }),
          React.createElement(
            'div',
            a$2('MOVE', {
              onTransitionEnd: onTransitionEnd,
              style: {
                background: background || BACKGROUND,
                transform: 'translateY(' + y + 'px)',
                transitionDuration:
                  (y === 0 || y === nowRootSize) && (duration || DURATION)
              }
            }),
            React.createElement(
              'div',
              a$2('WRAP', {
                style: { overflowY: y === 0 ? 'scroll' : 'hidden' }
              }),
              children
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
        return this.props.mountWithShut && lag().then(this.come)
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

        return isFn(Quit) && React.createElement(Quit, { fn: this.quit })
      }
    }
  ])
  return ShutFromBottom
})(React.Component)

var a$2 = Atra({
  ROOT: {
    style: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  },
  MOVE: {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      transitionProperty: 'transform'
    }
  },
  WRAP: {
    style: {
      height: '100%',
      overflowScrolling: 'touch'
      // WebkitOverflowScrolling: 'touch',
    }
  }
})

//
var ShutFromTop = (function(_React$Component) {
  inherits(ShutFromTop, _React$Component)
  createClass(ShutFromTop, [
    {
      key: 'come',
      value: function come() {
        this.setState({ y: 0 })
      }
    },
    {
      key: 'quit',
      value: function quit() {
        this.setState({ y: -this.nowRootSize })
      }
    },
    {
      key: 'canInit',
      value: function canInit(touches) {
        var touchRatio = this.props.touchRatio || TOUCH_RATIO
        // const reactionField = this.nowRootSize * (1 - touchRatio)
        var reactionField = window.innerHeight * (1 - touchRatio)
        return touches.length === 1 && touches[0].pageY > reactionField
      }
    }
  ])

  function ShutFromTop(props) {
    classCallCheck(this, ShutFromTop)

    var _this = possibleConstructorReturn(
      this,
      (ShutFromTop.__proto__ || Object.getPrototypeOf(ShutFromTop)).call(
        this,
        props
      )
    )

    _this.nowRootSize = window.innerHeight
    _this.state = { y: props.mountWithShut ? -_this.nowRootSize : 0 }
    _this.pre = new Pre()
    _this.rootRef = RootRef(_this, 'clientHeight')
    _this.come = _this.come.bind(_this)
    _this.quit = _this.quit.bind(_this)
    return _this
  }

  createClass(ShutFromTop, [
    {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this

        this.listeners = {}

        this.listeners.onTouchStart = function(_ref) {
          var touches = _ref.touches
          return _this2.canInit(touches) && _this2.pre.init(touches[0])
        }

        this.listeners.onTouchMove = function(_ref2) {
          var touches = _ref2.touches

          var touch = touches[0]
          var pre = _this2.pre

          if (pre.active) {
            var nowY = _this2.state.y
            var diffY = touch.pageY - pre.getY()

            pre.setY(touch.pageY)
            pre.setSettle(diffY < 0 ? _this2.quit : _this2.come)
            pre.setNow()

            var nextY = nowY + diffY
            return nextY < 0
              ? _this2.setState({ y: nextY })
              : nowY !== 0 && _this2.come()
          }
        }

        this.listeners.onTouchEnd = function() {
          if (_this2.pre.active) {
            var pre = _this2.pre,
              nowRootSize = _this2.nowRootSize
            var quitRatio = _this2.props.quitRatio
            var y = _this2.state.y

            var settle =
              Date.now() - pre.getNow() < 26
                ? pre.getSettle()
                : y < -(nowRootSize * (quitRatio || QUIT_RAIO))
                  ? _this2.quit
                  : _this2.come

            settle()
            pre.kill()
          }
        }

        this.listeners.onTransitionEnd = OnTransitionEnd(
          this,
          'translateY(0px)'
        )
      }
    },
    {
      key: 'render',
      value: function render() {
        var _listeners = this.listeners,
          onTouchStart = _listeners.onTouchStart,
          onTouchMove = _listeners.onTouchMove,
          onTouchEnd = _listeners.onTouchEnd,
          onTransitionEnd = _listeners.onTransitionEnd

        var ref = this.rootRef
        var nowRootSize = this.nowRootSize
        var y = this.state.y
        var _props = this.props,
          duration = _props.duration,
          background = _props.background,
          children = _props.children

        return React.createElement(
          'div',
          a$3('ROOT', {
            ref: ref,
            onTouchStart: onTouchStart,
            onTouchMove: onTouchMove,
            onTouchEnd: onTouchEnd
          }),
          React.createElement(
            'div',
            a$3('MOVE', {
              onTransitionEnd: onTransitionEnd,
              style: {
                background: background || BACKGROUND,
                transform: 'translateY(' + y + 'px)',
                transitionDuration:
                  (y === 0 || y === -nowRootSize) && (duration || DURATION)
              }
            }),
            React.createElement(
              'div',
              a$3('WRAP', {
                style: { overflowY: y === 0 ? 'scroll' : 'hidden' }
              }),
              children
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
        return this.props.mountWithShut && lag().then(this.come)
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

        return isFn(Quit) && React.createElement(Quit, { fn: this.quit })
      }
    }
  ])
  return ShutFromTop
})(React.Component)

var a$3 = Atra({
  ROOT: {
    style: {
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  },
  MOVE: {
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      transitionProperty: 'transform'
    }
  },
  WRAP: {
    style: {
      height: '100%',
      overflowScrolling: 'touch'
      // WebkitOverflowScrolling: 'touch',
    }
  }
})

export { ShutFromRight, ShutFromLeft, ShutFromBottom, ShutFromTop }
