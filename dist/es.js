import React from 'react'

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

var toConsumableArray = function(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i]

    return arr2
  } else {
    return Array.from(arr)
  }
}

//
var Shut = (function(_React$Component) {
  inherits(Shut, _React$Component)

  function Shut(props) {
    classCallCheck(this, Shut)

    var _this = possibleConstructorReturn(
      this,
      (Shut.__proto__ || Object.getPrototypeOf(Shut)).call(this, props)
    )

    _this.state = { x: props.rash ? 0 : innerWidth }

    _this.rootAttr = {
      onTouchStart: _this.touchStart.bind(_this),
      onTouchMove: _this.touchMove.bind(_this),
      onTouchEnd: _this.touchEnd.bind(_this),
      style: rootStyle
    }

    _this.mobileAttr = (function() {
      var onTransitionEnd = _this.transitionEnd.bind(_this)
      return function() {
        return {
          onTransitionEnd: onTransitionEnd,
          style: mobileStyle(
            _this.state.x,
            _this.props.mobile.transition,
            _this.props.mobile.background
          )
        }
      }
    })()

    _this.scrollAttr = function() {
      return {
        children: _this.props.children,
        style: scrollStyle(_this.state.x)
      }
    }

    _this.Quit = (function() {
      if (!props.Quit) {
        return false
      } else {
        var Quit = props.Quit,
          f = _this.quitHandler.bind(_this)

        return function() {
          return React.createElement(Quit, { f: f })
        }
      }
    })()
    return _this
  }

  createClass(Shut, [
    {
      key: 'lifecycleHandle',
      value: function lifecycleHandle(key, props, arg) {
        var lifecycles = props.lifecycles

        var lifecycle =
          (typeof lifecycles === 'undefined'
            ? 'undefined'
            : _typeof(lifecycles)) === 'object' && lifecycles[key]

        if (typeof lifecycle === 'function') {
          arg = arg || []
          lifecycle.apply(undefined, toConsumableArray(arg))
        }
      }
    },
    {
      key: 'componentWillMount',
      value: function componentWillMount() {
        return execLifeCycle('WillMount', this.props)
      }
    },
    {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        return nextProps.quit
          ? this.quit()
          : execLifeCycle('WillReceiveProps', this.props, [nextProps])
      }
    },
    {
      key: 'render',
      value: function render() {
        var rootAttr = this.rootAttr,
          mobileAttr = this.mobileAttr,
          scrollAttr = this.scrollAttr,
          Quit = this.Quit

        return React.createElement(
          'div',
          rootAttr,
          React.createElement(
            'div',
            mobileAttr(),
            React.createElement('div', scrollAttr()),
            Quit && Quit()
          )
        )
      }
    },
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this

        if (!this.props.rash) {
          setTimeout(function() {
            return _this2.come()
          }, 0)
          var first = this.props.callbacks.first

          if (first) first()
        }
        return execLifeCycle('DidMount', this.props)
      }
    },
    {
      key: 'componentDidUpdate',
      value: function componentDidUpdate(prevProps, prevState) {
        return execLifeCycle('DidUpdate', this.props, [prevProps, prevState])
      }
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        return execLifeCycle('WillUnmount', this.props)
      }
    },
    {
      key: 'touchStart',
      value: function touchStart(_ref) {
        var touches = _ref.touches

        if (cantStart(touches, this.props.widthRatio)) return false
        this.pre = new Pre(touches[0], { virgin: true })
      }
    },
    {
      key: 'touchMove',
      value: function touchMove(e) {
        if (!this.pre) return false

        var touch = e.touches[0]
        var pre = this.pre,
          state = this.state

        if (pre.virgin) {
          var yDiff = touch.pageY - pre.y
          if (yDiff < -10 || yDiff > 10) {
            this.pre = null
            return false
          }
        }

        var xDiff = touch.pageX - pre.x
        var iai = xDiff < 0 ? 'come' : 'quit'
        var x = state.x + xDiff

        this.pre = new Pre(touch, { iai: iai })

        return x <= 0
          ? state.x !== 0 ? this.come() : false
          : this.setState({ x: x })
      }
    },
    {
      key: 'touchEnd',
      value: function touchEnd(e) {
        var pre = this.pre

        if (!pre) return false

        var now = Date.now()

        if (now - pre.now < 26) {
          var iai = this[pre.iai]
          if (typeof iai === 'function') {
            iai.call(this)
          }
        } else {
          var quit = this.quit,
            come = this.come

          var qome = this.state.x > innerWidth * 0.6 ? quit : come

          qome.call(this)
        }

        this.pre = null
      }
    },
    {
      key: 'quitHandler',
      value: function quitHandler(e) {
        e.stopPropagation()
        this.quit()
      }
    },
    {
      key: 'come',
      value: function come() {
        this.setState({ x: 0 })
      }
    },
    {
      key: 'quit',
      value: function quit() {
        this.setState({ x: innerWidth })
      }
    },
    {
      key: 'transitionEnd',
      value: function transitionEnd(e) {
        var target = e.target,
          currentTarget = e.currentTarget,
          propertyName = e.propertyName

        if (target !== currentTarget || propertyName !== 'transform') {
          return false
        } else {
          var transform = target.style.transform
          var _props$callbacks = this.props.callbacks,
            come = _props$callbacks.come,
            quit = _props$callbacks.quit

          var callback = transform === 'translateX(0px)' ? come : quit
          if (callback) {
            callback()
          }
        }
      }
    }
  ])
  return Shut
})(React.Component)

var cantStart = function cantStart(touches, widthRatio) {
  if (touches.length > 1) {
    return true
  } else {
    widthRatio = widthRatio || 0.4
    return touches[0].pageX > innerWidth * widthRatio
  }
}

var Pre = function Pre(_ref2, _ref3) {
  var pageX = _ref2.pageX,
    pageY = _ref2.pageY
  var virgin = _ref3.virgin,
    iai = _ref3.iai

  this.x = pageX
  this.y = pageY
  this.now = Date.now()
  this.virgin = virgin
  this.iai = iai
}

var rootStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
}

var TRANSITION = '0.4s'
var BACKGROUND = 'rgb(251, 251, 251)'
var mobileStyle = function mobileStyle(x, transition, background) {
  return {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    transition: (x === 0 || x === innerWidth) && (transition || TRANSITION),
    transform: 'translateX(' + x + 'px)',
    background: background || BACKGROUND
  }
}

var scrollStyle = function scrollStyle(x) {
  return {
    overflowY: x === 0 ? 'scroll' : 'hidden',
    height: '100%',
    WebkitOverflowScrolling: 'touch',
    overflowScrolling: 'touch'
  }
}

export default Shut
