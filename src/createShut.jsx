// @flow
import React from 'react'
import Atra from 'atra'
import Pre from './Pre.js'
import { BACKGROUND, isFnc } from './util.js'
import {
  type Seed,
  type Come,
  type Quit,
  type CanInit,
  type GetRootSize
} from './type.js'

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

const raf = (fn: () => void) => window.requestAnimationFrame(fn)

export default (seed: Seed): React$ComponentType<*> =>
  class Shut extends React.Component<Props,State> {
    nowRootSize: number
    pre: Pre
    come: Come
    quit: Quit
    canInit: CanInit
    a: (name: string, opts: any) => any
    renderValues: () => {
      transform: string,
      transitionDuration: false | string,
      background: string,
      overflowY: string
    }
    getRootSize: GetRootSize

    constructor(props) {
      super(props)

      const unique = seed(this)

      // state
      this.nowRootSize = unique.firstRootSize
      this.pre = new Pre()
      this.state = { value: props.mountWithShut ? this.nowRootSize : 0 }

      // core
      this.come = () => this.setState({ value: 0 })
      this.quit = unique.quit
      this.canInit = unique.canInit

      // a
      this.a = A({
        ref: unique.rootRef,
        onTouchStartCapture: ({ touches }) => this.canInit(touches) && this.pre.init(touches[0]),
        onTouchMoveCapture: unique.onTouchMoveCapture,
        onTouchEndCapture: unique.onTouchEndCapture,
        onTransitionEnd: unique.onTransitionEnd
      })

      // render
      this.renderValues = () => ({
        transform: unique.transform(),
        transitionDuration: unique.transitionDuration(),
        background: this.props.background || BACKGROUND,
        overflowY: !this.props.notScroll && this.state.value === 0 ? 'scroll' : 'hidden'
      })
    }

    render() {
      const { a, renderValues } = this
      const { transform, transitionDuration, background, overflowY } = renderValues()

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

    setRootSize() {
      this.nowRootSize = this.getRootSize()
    }

    componentDidMount() {
      this.setRootSize()
      return this.props.mountWithShut && raf(this.come)
    }

    componentDidUpdate() {
      this.setRootSize()
    }

    createQuit() {
      const { Quit } = this.props
      return Quit && isFnc(Quit) && <Quit fn={this.quit} />
    }
  }

const A = ({
  ref,
  onTouchStartCapture,
  onTouchMoveCapture,
  onTouchEndCapture,
  onTransitionEnd
}) => Atra({
  ROOT: {
    ref,
    onTouchStartCapture,
    onTouchMoveCapture,
    onTouchEndCapture,
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