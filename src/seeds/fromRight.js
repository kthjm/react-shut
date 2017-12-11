// @flow
import {
  DURATION,
  TOUCH_RATIO,
  QUIT_RATIO,
  winnerWidth,
  createRootRef,
  createOnTouchEnd,
  createOnTransitionEnd
} from '../util.js'
import { type Seed } from '../type.js'

const seed: Seed = react => ({
  firstRootSize: winnerWidth(),

  rootRef: createRootRef(react, 'clientWidth'),

  quit: () => react.setState({ value: react.nowRootSize }),

  canInit: touches => {
    const touchRatio = react.props.touchRatio || TOUCH_RATIO
    const reactionField = winnerWidth() * touchRatio
    return touches.length === 1 && touches[0].pageX < reactionField
  },

  onTouchMove: ({ touches }) => {
    const touch = touches[0]
    const { pre } = react

    if (pre.active() && pre.notScroll(touch.pageY)) {
      const nowX = react.state.value
      const diffX = touch.pageX - pre.getX()

      pre.setX(touch.pageX)
      pre.setSettle(diffX < 0 ? react.come : react.quit)
      pre.setNow()

      const nextX = nowX + diffX
      return nextX > 0
        ? react.setState({ value: nextX })
        : nowX !== 0 && react.come()
    }
  },

  onTouchEnd: createOnTouchEnd(react, () => {
    const { nowRootSize } = react
    const { value } = react.state
    const quitRatio = react.props.quitRatio || QUIT_RATIO
    return value > nowRootSize * quitRatio
  }),

  onTransitionEnd: createOnTransitionEnd(react, 'translateX(0px)'),

  transform: () => `translateX(${react.state.value}px)`,

  transitionDuration: () =>
    (react.state.value === 0 || react.state.value === react.nowRootSize) &&
    `${react.props.duration || DURATION}s`
})

export default seed
