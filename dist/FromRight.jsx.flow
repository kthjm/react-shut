// @flow
import React from 'react'
import Atra from 'atra'
import Pre from './Pre.js'
import {
  DURATION,
  BACKGROUND,
  TOUCH_RATIO,
  QUIT_RAIO,
  lag,
  isFn,
  RootRef,
  OnTransitionEnd
} from './util.js'

export default class ShutFromRight extends React.Component {
  come() {
    this.setState({ x: 0 })
  }

  quit() {
    this.setState({ x: this.nowRootSize })
  }

  canInit(touches) {
    const touchRatio = this.props.touchRatio || TOUCH_RATIO
    const reactionField = window.innerWidth * touchRatio
    return touches.length === 1 && touches[0].pageX < reactionField
  }

  constructor(props) {
    super(props)
    this.nowRootSize = window.innerWidth
    this.state = { x: props.mountWithShut ? this.nowRootSize : 0 }
    this.pre = new Pre()
    this.rootRef = RootRef(this, 'clientWidth')
    this.come = this.come.bind(this)
    this.quit = this.quit.bind(this)
  }

  componentWillMount() {
    this.listeners = {}

    this.listeners.onTouchStart = ({ touches }) =>
      this.canInit(touches) && this.pre.init(touches[0])

    this.listeners.onTouchMove = ({ touches }) => {
      const touch = touches[0]
      const { pre } = this

      if (pre.active && !pre.isScroll(touch.pageY)) {
        const nowX = this.state.x
        const diffX = touch.pageX - pre.getX()

        pre.setX(touch.pageX)
        pre.setSettle(diffX < 0 ? this.come : this.quit)
        pre.setNow()

        const nextX = nowX + diffX
        return nextX > 0
          ? this.setState({ x: nextX })
          : nowX !== 0 && this.come()
      }
    }

    this.listeners.onTouchEnd = () => {
      if (this.pre.active) {
        const { pre, nowRootSize } = this
        const { quitRatio } = this.props
        const { x } = this.state

        const settle =
          Date.now() - pre.getNow() < 26
            ? pre.getSettle()
            : x > nowRootSize * (quitRatio || QUIT_RAIO) ? this.quit : this.come

        settle()
        pre.kill()
      }
    }

    this.listeners.onTransitionEnd = OnTransitionEnd(this, 'translateX(0px)')
  }

  render() {
    const {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTransitionEnd
    } = this.listeners

    const ref = this.rootRef
    const { nowRootSize } = this
    const { x } = this.state
    const { duration, background, children } = this.props

    return (
      <div {...a('ROOT', { ref, onTouchStart, onTouchMove, onTouchEnd })}>
        <div {...a('MOVE', {
          onTransitionEnd,
          style: {
            background: background || BACKGROUND,
            transform: `translateX(${x}px)`,
            transitionDuration: (x === 0 || x === nowRootSize) && (duration || DURATION)
          }
        })}>
          <div {...a('WRAP', { style: { overflowY: x === 0 ? 'scroll' : 'hidden' } })}>
            {children}
          </div>
          {this.createQuit()}
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.nowRootSize = this.rootSize()
    return this.props.mountWithShut && lag().then(this.come)
  }

  componentDidUpdate() {
    const rootSize = this.rootSize()
    if (rootSize !== this.nowRootSize) {
      this.nowRootSize = rootSize
    }
  }

  createQuit() {
    const { Quit } = this.props
    return isFn(Quit) && <Quit fn={this.quit} />
  }
}

const a = Atra({
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
