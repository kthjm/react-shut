// @flow
import React from 'react'
import Atra from 'atra'
import Pre from './Pre.js'
import { BACKGROUND, isFn } from './util.js'
import {
  type Seed,
  type Transform,
  type TransitionDuration,
  type Come,
  type Quit,
  type CanInit,
  type RootSize
} from './type.js'

const raf = (fn: () => void) => window.requestAnimationFrame(fn)

export default (seed: Seed): React$ComponentType<*> =>
  class Shut extends React.Component<Props,State> {
    nowRootSize: number
    pre: Pre
    come: Come
    quit: Quit
    canInit: CanInit
    rootSize: RootSize
    a: Atra$Result
    renders: Renders

    constructor(props) {
      super(props)

      const unique = seed(this)

      // state
      this.nowRootSize = unique.firstRootSize
      this.state = { value: props.mountWithShut ? this.nowRootSize : 0 }
      this.pre = new Pre()

      // core
      this.come = () => this.setState({ value: 0 })
      this.quit = unique.quit
      this.canInit = unique.canInit

      // a
      this.a = A({
        ref: unique.rootRef,
        onTouchStart: ({ touches }) => this.canInit(touches) && this.pre.init(touches[0]),
        onTouchMove: unique.onTouchMove,
        onTouchEnd: unique.onTouchEnd,
        onTransitionEnd: unique.onTransitionEnd
      })

      // render
      this.renders = {
        transform: unique.transform,
        transitionDuration: unique.transitionDuration,
        background: () => this.props.background || BACKGROUND,
        overflowY: () => !this.props.notScroll && this.state.value === 0 ? 'scroll' : 'hidden'
      }
    }

    render() {
      const { a } = this
      const transform = this.renders.transform()
      const transitionDuration = this.renders.transitionDuration()
      const background = this.renders.background()
      const overflowY = this.renders.overflowY()

      return (
        <div {...a('ROOT')}>
          <div {...a('MOVE', { style: { transform, transitionDuration, background } })}>
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
      return this.props.mountWithShut && raf(this.come)
    }

    componentDidUpdate() {
      const rootSize = this.rootSize()
      if (rootSize !== this.nowRootSize) {
        this.nowRootSize = rootSize
      }
    }

    createQuit() {
      const { Quit } = this.props
      return Quit && isFn(Quit) && <Quit fn={this.quit} />
    }
  }

const A = ({
  ref,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTransitionEnd
}) => Atra({
  ROOT: {
    ref,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
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
    onTransitionEnd,
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

type State = { value: number }

type Props = {
  children: React$Node,
  mountWithShut?: boolean,
  Quit?: () => React$Node,
  onQuitEnd?: (e: SyntheticTransitionEvent<HTMLDivElement>) => void,
  onQuitEnd?: (e: SyntheticTransitionEvent<HTMLDivElement>) => void,
  background?: string,
  duration?: number,
  touchRatio?: number,
  quitRatio?: number,
  notScroll?: boolean
}

type Atra$Result = (name: string, opts: any) => any

type Renders = {
  transform: Transform,
  transitionDuration: TransitionDuration,
  background: () => string,
  overflowY: () => string
}