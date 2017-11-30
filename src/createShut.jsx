// @flow
import React from 'react'
import Atra from 'atra'
import Pre from './Pre.js'
import { BACKGROUND, isFn } from './util.js'

export default seed =>
  class Shut extends React.Component {
    constructor(props) {
      super(props)

      const unique = seed(this)

      // state
      this.nowRootSize = unique.firstRootSize
      this.state = { value: props.mountWithShut ? this.nowRootSize : 0 }
      this.pre = new Pre()

      // core
      this.rootRef = unique.rootRef
      this.come = () => this.setState({ value: 0 })
      this.quit = unique.quit
      this.canInit = unique.canInit

      // listener
      this.listeners = {}
      this.listeners.onTouchStart = ({ touches }) => this.canInit(touches) && this.pre.init(touches[0])
      this.listeners.onTouchMove = unique.onTouchMove
      this.listeners.onTouchEnd = unique.onTouchEnd
      this.listeners.onTransitionEnd = unique.onTransitionEnd

      // render
      this.renders = {}
      this.renders.transform = unique.transform
      this.renders.transitionDuration = unique.transitionDuration
    }

    render() {
      const ref = this.rootRef
      const { onTouchStart, onTouchMove, onTouchEnd, onTransitionEnd } = this.listeners
      const background = this.props.background || BACKGROUND
      const transform = this.renders.transform()
      const transitionDuration = this.renders.transitionDuration()
      const overflowY = this.state.value === 0 ? 'scroll' : 'hidden'

      return (
        <div {...a('ROOT', { ref, onTouchStart, onTouchMove, onTouchEnd })}>
          <div {...a('MOVE', { onTransitionEnd, style: { background, transform, transitionDuration } })}>
            <div {...a('WRAP', { style: { overflowY } })}>
              {this.props.children}
            </div>
            {this.createQuit()}
          </div>
        </div>
      )
    }

    componentDidMount() {
      this.nowRootSize = this.rootSize()
      return this.props.mountWithShut && requestAnimationFrame(this.come)
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