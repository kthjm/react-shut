// @flow
import {
  DURATION,
  TOUCH_RATIO,
  QUIT_RATIO,
  winnerHeight,
  createRootRef,
  createOnTouchEnd,
  createOnTransitionEnd
} from '../util.js'
import { type Seed } from '../type.js'

const seed: Seed = react => ({
  firstRootSize: winnerHeight(),

  rootRef: createRootRef(react, 'clientHeight'),

  quit: () => react.setState({ value: react.nowRootSize }),

  canInit: touches => {
    const touchRatio = react.props.touchRatio || TOUCH_RATIO
    const reactionField = winnerHeight() * touchRatio
    return touches.length === 1 && touches[0].pageY < reactionField
  },

  onTouchMove: ({ touches }) => {
    const touch = touches[0]
    const { pre } = react

    if (pre.active()) {
      const nowY = react.state.value
      const diffY = touch.pageY - pre.getY()

      pre.setY(touch.pageY)
      pre.setSettle(diffY < 0 ? react.come : react.quit)
      pre.setNow()

      const nextY = nowY + diffY
      return nextY > 0
        ? react.setState({ value: nextY })
        : nowY !== 0 && react.come()
    }
  },

  onTouchEnd: createOnTouchEnd(react, () => {
    const { nowRootSize } = react
    const { value } = react.state
    const quitRatio = react.props.quitRatio || QUIT_RATIO
    return value > nowRootSize * quitRatio
  }),

  onTransitionEnd: createOnTransitionEnd(react, 'translateY(0px)'),

  transform: () => `translateY(${react.state.value}px)`,

  transitionDuration: () =>
    (react.state.value === 0 || react.state.value === react.nowRootSize) &&
    `${react.props.duration || DURATION}s`
})

export default seed
