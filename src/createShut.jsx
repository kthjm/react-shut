// @flow
import React from 'react'
import Atra from 'atra'
import Pre from './Pre.js'
import { BACKGROUND, isFnc, isNum } from './util.js'
import {
  type Seed,
  type Transform,
  type TransitionDuration,
  type Come,
  type Quit,
  type CanInit,
  type GetRootSize,
  type GetRootWidth
} from './type.js'

const SCROLL_BAR = 17
const raf = (fn: () => void) => window.requestAnimationFrame(fn)

export default (seed: Seed): React$ComponentType<*> =>
  class Shut extends React.Component<Props,State> {
    nowRootSize: number
    mountWithHidden: boolean
    pre: Pre
    come: Come
    quit: Quit
    canInit: CanInit
    getRootSize: GetRootSize
    getRootWidth: GetRootWidth
    a: Atra$Result
    renders: Renders

    constructor(props) {
      super(props)

      const unique = seed(this)

      // state
      this.nowRootSize = unique.firstRootSize
      this.mountWithHidden = props.mountWithShut && props.hiddenBar
      this.pre = new Pre()
      this.state = {
        rootWidth: undefined,
        value: props.mountWithShut ? this.nowRootSize : 0
      }

      // core
      this.come = () => this.setState({ value: 0 })
      this.quit = unique.quit
      this.canInit = unique.canInit

      // a
      this.a = A({
        ref: unique.rootRef,
        onTouchStartCapture: (e) => {
          const { touches } = e
          if(this.canInit(touches)){
            e.stopPropagation()
            this.pre.init(touches[0])
          }
        },
        onTouchMove: unique.onTouchMove,
        onTouchEnd: unique.onTouchEnd,
        onTransitionEnd: (e) => {
          if(this.mountWithHidden){
            e.persist()
            this.mountWithHidden = false
            this.forceUpdate(() => unique.onTransitionEnd(e, true))
          }else{
            unique.onTransitionEnd(e)
          }
        }
      })

      // render
      this.renders = {
        transform: unique.transform,
        transitionDuration: unique.transitionDuration,
        background: () => this.props.background || BACKGROUND,
        overflowY: () => (
          !this.mountWithHidden && !this.props.notScroll && this.state.value === 0
            ? 'scroll'
            : 'hidden'
        )
      }
    }

    render() {
      const { a } = this
      const transform = this.renders.transform()
      const transitionDuration = this.renders.transitionDuration()
      const background = this.renders.background()
      const overflowY = this.renders.overflowY()

      const { rootWidth } = this.state
      const width = (isNum(rootWidth) && this.props.hiddenBar && overflowY === 'scroll')
        ? rootWidth + SCROLL_BAR
        : '100%'

      return (
        <div {...a('ROOT')}>
          <div {...a('MOVE', { style: { transform, transitionDuration, background } })}>
            <div {...a('WRAP', { style: { overflowY, width } })}>
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

      const value = this.props.mountWithShut ? 0 : this.state.value
      const rootWidth = this.getRootWidth()
      return raf(() => this.setState({ rootWidth, value }))
    }

    componentDidUpdate() {
      this.setRootSize()
      const rootWidth = this.getRootWidth()
      return rootWidth !== this.state.rootWidth && this.setState({ rootWidth })
    }

    createQuit() {
      const { Quit } = this.props
      return Quit && isFnc(Quit) && <Quit fn={this.quit} />
    }
  }

const A = ({
  ref,
  onTouchStartCapture,
  onTouchMove,
  onTouchEnd,
  onTransitionEnd
}) => Atra({
  ROOT: {
    ref,
    onTouchStartCapture,
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

type State = {
  rootWidth: void | number,
  value: number
}

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
  notScroll?: boolean,
  hiddenBar?: boolean
}

type Atra$Result = (name: string, opts: any) => any

type Renders = {
  transform: Transform,
  transitionDuration: TransitionDuration,
  background: () => string,
  overflowY: () => string
}