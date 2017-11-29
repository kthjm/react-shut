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
var TOUCH_RATIO = 0.4
var QUIT_RAIO = 0.6

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
var BACKGROUND = 'rgb(251, 251, 251)'
var lag = function lag() {
  var time =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 60
  return new Promise(function(resolve) {
    return setTimeout(resolve, time)
  })
}

var HoShut = function(ho) {
  return (function(_React$Component) {
    inherits(Shut, _React$Component)

    function Shut(props) {
      classCallCheck(this, Shut)

      var _this = possibleConstructorReturn(
        this,
        (Shut.__proto__ || Object.getPrototypeOf(Shut)).call(this, props)
      )

      var unique = ho(_this)

      // state
      _this.nowRootSize = unique.firstRootSize
      _this.state = { value: props.mountWithShut ? _this.nowRootSize : 0 }
      _this.pre = new Pre()

      // core
      _this.rootRef = unique.rootRef
      _this.come = function() {
        return _this.setState({ value: 0 })
      }
      _this.quit = unique.quit
      _this.canInit = unique.canInit

      // listener
      _this.listeners = {}
      _this.listeners.onTouchStart = function(_ref) {
        var touches = _ref.touches
        return _this.canInit(touches) && _this.pre.init(touches[0])
      }
      _this.listeners.onTouchMove = unique.onTouchMove
      _this.listeners.onTouchEnd = unique.onTouchEnd
      _this.listeners.onTransitionEnd = unique.onTransitionEnd

      // render
      _this.renders = {}
      _this.renders.transform = unique.transform
      _this.renders.transitionDuration = unique.transitionDuration
      return _this
    }

    createClass(Shut, [
      {
        key: 'render',
        value: function render() {
          var ref = this.rootRef
          var _listeners = this.listeners,
            onTouchStart = _listeners.onTouchStart,
            onTouchMove = _listeners.onTouchMove,
            onTouchEnd = _listeners.onTouchEnd,
            onTransitionEnd = _listeners.onTransitionEnd

          var background = this.props.background || BACKGROUND
          var transform = this.renders.transform()
          var transitionDuration = this.renders.transitionDuration()

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
                  background: background,
                  transform: transform,
                  transitionDuration: transitionDuration
                }
              }),
              React.createElement(
                'div',
                a('WRAP', {
                  style: {
                    overflowY: this.state.value === 0 ? 'scroll' : 'hidden'
                  }
                }),
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
          var _this2 = this

          this.nowRootSize = this.rootSize()
          return (
            this.props.mountWithShut &&
            lag().then(function() {
              return _this2.come()
            })
          )
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
    return Shut
  })(React.Component)
}

var a = Atra({
  ROOT: {
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
      overflowScrolling: 'touch',
      WebkitOverflowScrolling: 'touch'
    }
  }
})

//
var fromBottom = function(react) {
  return {
    firstRootSize: window.innerHeight,

    rootRef: RootRef(react, 'clientHeight'),

    quit: function quit() {
      return react.setState({ value: react.nowRootSize })
    },

    transform: function transform() {
      return 'translateY(' + react.state.value + 'px)'
    },

    transitionDuration: function transitionDuration() {
      return (
        (react.state.value === 0 || react.state.value === react.nowRootSize) &&
        (react.props.duration || DURATION)
      )
    },

    canInit: function canInit(touches) {
      var touchRatio = react.props.touchRatio || TOUCH_RATIO
      var reactionField = window.innerHeight * touchRatio
      return touches.length === 1 && touches[0].pageY < reactionField
    },

    onTouchMove: function onTouchMove(_ref) {
      var touches = _ref.touches

      var touch = touches[0]
      var pre = react.pre

      if (pre.active) {
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

    onTouchEnd: function onTouchEnd() {
      if (react.pre.active) {
        var pre = react.pre,
          nowRootSize = react.nowRootSize
        var quitRatio = react.props.quitRatio
        var value = react.state.value

        var settle =
          Date.now() - pre.getNow() < 26
            ? pre.getSettle()
            : value > nowRootSize * (quitRatio || QUIT_RAIO)
              ? react.quit
              : react.come

        settle()
        pre.kill()
      }
    },

    onTransitionEnd: OnTransitionEnd(react, 'translateY(0px)')
  }
}

//
var fromLeft = function(react) {
  return {
    firstRootSize: -window.innerWidth,

    rootRef: RootRef(react, 'clientWidth'),

    quit: function quit() {
      return react.setState({ value: -react.nowRootSize })
    },

    transform: function transform() {
      return 'translateX(' + react.state.value + 'px)'
    },

    transitionDuration: function transitionDuration() {
      return (
        (react.state.value === 0 || react.state.value === -react.nowRootSize) &&
        (react.props.duration || DURATION)
      )
    },

    canInit: function canInit(touches) {
      var touchRatio = react.props.touchRatio || TOUCH_RATIO
      var reactionField = window.innerWidth * (1 - touchRatio)
      return touches.length === 1 && touches[0].pageX > reactionField
    },

    onTouchMove: function onTouchMove(_ref) {
      var touches = _ref.touches

      var touch = touches[0]
      var pre = react.pre

      if (pre.active && !pre.isScroll(touch.pageY)) {
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

    onTouchEnd: function onTouchEnd() {
      if (react.pre.active) {
        var pre = react.pre,
          nowRootSize = react.nowRootSize
        var quitRatio = react.props.quitRatio
        var value = react.state.value

        var settle =
          Date.now() - pre.getNow() < 26
            ? pre.getSettle()
            : value < -(nowRootSize * (quitRatio || QUIT_RAIO))
              ? react.quit
              : react.come

        settle()
        pre.kill()
      }
    },

    onTransitionEnd: OnTransitionEnd(react, 'translateX(0px)')
  }
}

//
var fromRight = function(react) {
  return {
    firstRootSize: window.innerWidth,

    rootRef: RootRef(react, 'clientWidth'),

    quit: function quit() {
      return react.setState({ value: react.nowRootSize })
    },

    transform: function transform() {
      return 'translateX(' + react.state.value + 'px)'
    },

    transitionDuration: function transitionDuration() {
      return (
        (react.state.value === 0 || react.state.value === react.nowRootSize) &&
        (react.props.duration || DURATION)
      )
    },

    canInit: function canInit(touches) {
      var touchRatio = react.props.touchRatio || TOUCH_RATIO
      var reactionField = react.nowRootSize * touchRatio
      return touches.length === 1 && touches[0].pageX < reactionField
    },

    onTouchMove: function onTouchMove(_ref) {
      var touches = _ref.touches

      var touch = touches[0]
      var pre = react.pre

      if (pre.active && !pre.isScroll(touch.pageY)) {
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

    onTouchEnd: function onTouchEnd() {
      if (react.pre.active) {
        var pre = react.pre,
          nowRootSize = react.nowRootSize
        var quitRatio = react.props.quitRatio
        var value = react.state.value

        var settle =
          Date.now() - pre.getNow() < 26
            ? pre.getSettle()
            : value > nowRootSize * (quitRatio || QUIT_RAIO)
              ? react.quit
              : react.come

        settle()
        pre.kill()
      }
    },

    onTransitionEnd: OnTransitionEnd(react, 'translateX(0px)')
  }
}

//
var fromTop = function(react) {
  return {
    firstRootSize: -window.innerHeight,

    rootRef: RootRef(react, 'clientHeight'),

    quit: function quit() {
      return react.setState({ value: -react.nowRootSize })
    },

    transform: function transform() {
      return 'translateY(' + react.state.value + 'px)'
    },

    transitionDuration: function transitionDuration() {
      return (
        (react.state.value === 0 || react.state.value === -react.nowRootSize) &&
        (react.props.duration || DURATION)
      )
    },

    canInit: function canInit(touches) {
      var touchRatio = react.props.touchRatio || TOUCH_RATIO
      var reactionField = window.innerHeight * (1 - touchRatio)
      return touches.length === 1 && touches[0].pageY > reactionField
    },

    onTouchMove: function onTouchMove(_ref) {
      var touches = _ref.touches

      var touch = touches[0]
      var pre = react.pre

      if (pre.active) {
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

    onTouchEnd: function onTouchEnd() {
      if (react.pre.active) {
        var pre = react.pre,
          nowRootSize = react.nowRootSize
        var quitRatio = react.props.quitRatio
        var value = react.state.value

        var settle =
          Date.now() - pre.getNow() < 26
            ? pre.getSettle()
            : value < -(nowRootSize * (quitRatio || QUIT_RAIO))
              ? react.quit
              : react.come

        settle()
        pre.kill()
      }
    },

    onTransitionEnd: OnTransitionEnd(react, 'translateY(0px)')
  }
}

var ShutFromBottom = HoShut(fromBottom)
var ShutFromLeft = HoShut(fromLeft)
var ShutFromRight = HoShut(fromRight)
var ShutFromTop = HoShut(fromTop)

export { ShutFromBottom, ShutFromLeft, ShutFromRight, ShutFromTop }
