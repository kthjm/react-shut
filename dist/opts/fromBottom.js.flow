// @flow
import {
  DURATION,
  TOUCH_RATIO,
  QUIT_RAIO,
  RootRef,
  OnTransitionEnd
} from '../util.js'

export default react => ({
  firstRootSize: window.innerHeight,

  rootRef: RootRef(react, 'clientHeight'),

  quit: () => react.setState({ value: react.nowRootSize }),

  transform: () => `translateY(${react.state.value}px)`,

  transitionDuration: () =>
    (react.state.value === 0 || react.state.value === react.nowRootSize) &&
    (react.props.duration || DURATION),

  canInit: touches => {
    const touchRatio = react.props.touchRatio || TOUCH_RATIO
    const reactionField = window.innerHeight * touchRatio
    return touches.length === 1 && touches[0].pageY < reactionField
  },

  onTouchMove: ({ touches }) => {
    const touch = touches[0]
    const { pre } = react

    if (pre.active) {
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

  onTouchEnd: () => {
    if (react.pre.active) {
      const { pre, nowRootSize } = react
      const { quitRatio } = react.props
      const { value } = react.state

      const settle =
        Date.now() - pre.getNow() < 26
          ? pre.getSettle()
          : value > nowRootSize * (quitRatio || QUIT_RAIO)
            ? react.quit
            : react.come

      settle()
      pre.kill()
    }
  },

  onTransitionEnd: OnTransitionEnd(react, 'translateY(0px)')
})
