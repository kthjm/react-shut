// @flow
import {
  DURATION,
  TOUCH_RATIO,
  QUIT_RATIO,
  RootRef,
  OnTouchEnd,
  OnTransitionEnd
} from './util.js'

export default react => ({
  firstRootSize: -window.innerHeight,

  rootRef: RootRef(react, 'clientHeight'),

  quit: () => react.setState({ value: -react.nowRootSize }),

  canInit: touches => {
    const touchRatio = react.props.touchRatio || TOUCH_RATIO
    const reactionField = window.innerHeight * (1 - touchRatio)
    return touches.length === 1 && touches[0].pageY > reactionField
  },

  onTouchMove: ({ touches }) => {
    const touch = touches[0]
    const { pre } = react

    if (pre.active) {
      const nowY = react.state.value
      const diffY = touch.pageY - pre.getY()

      pre.setY(touch.pageY)
      pre.setSettle(diffY < 0 ? react.quit : react.come)
      pre.setNow()

      const nextY = nowY + diffY
      return nextY < 0
        ? react.setState({ value: nextY })
        : nowY !== 0 && react.come()
    }
  },

  onTouchEnd: OnTouchEnd(react, () => {
    const { nowRootSize } = react
    const { value } = react.state
    const quitRatio = react.props.quitRatio || QUIT_RATIO
    return value < -(nowRootSize * quitRatio)
  }),

  onTransitionEnd: OnTransitionEnd(react, 'translateY(0px)'),

  transform: () => `translateY(${react.state.value}px)`,

  transitionDuration: () =>
    (react.state.value === 0 || react.state.value === -react.nowRootSize) &&
    (react.props.duration || DURATION)
})
