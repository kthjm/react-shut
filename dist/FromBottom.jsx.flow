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

export default class ShutFromBottom extends React.Component {
  come() {
    this.setState({ y: 0 })
  }

  quit() {
    this.setState({ y: this.nowRootSize })
  }

  canInit(touches) {
    const touchRatio = this.props.touchRatio || TOUCH_RATIO
    const reactionField = window.innerHeight * touchRatio
    return touches.length === 1 && touches[0].pageY < reactionField
  }

  constructor(props) {
    super(props)
    this.nowRootSize = window.innerHeight
    this.state = { y: props.mountWithShut ? this.nowRootSize : 0 }
    this.pre = new Pre()
    this.rootRef = RootRef(this, 'clientHeight')
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

      if (pre.active) {
        const nowY = this.state.y
        const diffY = touch.pageY - pre.getY()

        pre.setY(touch.pageY)
        pre.setSettle(diffY < 0 ? this.come : this.quit)
        pre.setNow()

        const nextY = nowY + diffY
        return nextY > 0
          ? this.setState({ y: nextY })
          : nowY !== 0 && this.come()
      }
    }

    this.listeners.onTouchEnd = () => {
      if (this.pre.active) {
        const { pre, nowRootSize } = this
        const { quitRatio } = this.props
        const { y } = this.state

        const settle =
          Date.now() - pre.getNow() < 26
            ? pre.getSettle()
            : y > nowRootSize * (quitRatio || QUIT_RAIO) ? this.quit : this.come

        settle()
        pre.kill()
      }
    }

    this.listeners.onTransitionEnd = OnTransitionEnd(this, 'translateY(0px)')
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
    const { y } = this.state
    const { duration, background, children } = this.props

    return (
      <div {...a('ROOT', { ref, onTouchStart, onTouchMove, onTouchEnd })}>
        <div {...a('MOVE', {
          onTransitionEnd,
          style: {
            background: background || BACKGROUND,
            transform: `translateY(${y}px)`,
            transitionDuration: (y === 0 || y === nowRootSize) && (duration || DURATION)
          }
        })}>
          <div {...a('WRAP', { style: { overflowY: y === 0 ? 'scroll' : 'hidden' } })}>
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
