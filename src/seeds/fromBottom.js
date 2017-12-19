// @flow
import {
  DURATION,
  TOUCH_RATIO,
  QUIT_RATIO,
  winnerHeight,
  createRootRef,
  createOnTouchEnd,
  createOnTransitionEnd,
  isNum
} from '../util.js'
import { type Seed } from '../type.js'

const seed: Seed = react => ({
  firstRootSize: winnerHeight(),

  rootRef: createRootRef(react, 'clientHeight'),

  quit: () => react.setState({ value: react.nowRootSize }),

  canInit: touches => {
    const { touchRatio } = react.props
    const ratio = isNum(touchRatio) ? touchRatio : TOUCH_RATIO
    const reactionField = winnerHeight() * ratio
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
    const { quitRatio } = react.props
    const ratio = isNum(quitRatio) ? quitRatio : QUIT_RATIO
    return value > nowRootSize * ratio
  }),

  onTransitionEnd: createOnTransitionEnd(react, 'translateY(0px)'),

  transform: () => `translateY(${react.state.value}px)`,

  transitionDuration: () =>
    (react.state.value === 0 || react.state.value === react.nowRootSize) &&
    `${isNum(react.props.duration) ? react.props.duration : DURATION}s`
})

export default seed
