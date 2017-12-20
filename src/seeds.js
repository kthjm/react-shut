// @flow
import { DURATION, TOUCH_RATIO, QUIT_RATIO, isFnc, isNum } from './util.js'
import {
  type Seed,
  type RootRef,
  type GetRootSize,
  type GetRootWidth,
  type OnTouchEndCapture,
  type OnTransitionEnd
} from './type.js'

const winnerWidth = (): number => window.innerWidth

const winnerHeight = (): number => window.innerHeight

const createRootRef = (
  react: *,
  key: 'clientWidth' | 'clientHeight'
): RootRef =>
  function(target) {
    if (target) {
      const getRootSize: GetRootSize = () => target[key]
      const getRootWidth: GetRootWidth = () => target.clientWidth
      react.getRootSize = getRootSize
      react.getRootWidth = getRootWidth
    }
  }

const createOnTouchEndCapture = (
  react: *,
  quitCondition: () => boolean
): OnTouchEndCapture => e => {
  const { pre } = react
  if (pre.canEnd()) {
    e.stopPropagation()
    e.preventDefault()
    const settle =
      pre.getSettle() || (quitCondition() ? react.quit : react.come)
    settle()
    pre.kill()
  }
}

const createOnTransitionEnd = (
  react: *,
  onComeKey: 'translateX(0px)' | 'translateY(0px)'
): OnTransitionEnd => (e, persisted) => {
  if (persisted || e.target === e.currentTarget) {
    const target: HTMLDivElement = e.currentTarget || e.target

    const onCuit =
      target.style.transform === onComeKey
        ? react.props.onComeEnd
        : react.props.onQuitEnd

    if (onCuit && isFnc(onCuit)) {
      onCuit(e)
    }
  }
}

export const seedFromTop: Seed = react => ({
  firstRootSize: -winnerHeight(),
  rootRef: createRootRef(react, 'clientHeight'),
  quit: () => react.setState({ value: -react.nowRootSize }),
  canInit: touches => {
    const { touchRatio } = react.props
    const ratio = isNum(touchRatio) ? touchRatio : TOUCH_RATIO
    const reactionField = winnerHeight() * (1 - ratio)
    return touches.length === 1 && touches[0].pageY > reactionField
  },
  onTouchMoveCapture: ({ touches }) => {
    const touch = touches[0]
    const { pre } = react

    if (pre.canMove()) {
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
  onTouchEndCapture: createOnTouchEndCapture(react, () => {
    const { nowRootSize } = react
    const { value } = react.state
    const { quitRatio } = react.props
    const ratio = isNum(quitRatio) ? quitRatio : QUIT_RATIO
    return value < -(nowRootSize * ratio)
  }),
  onTransitionEnd: createOnTransitionEnd(react, 'translateY(0px)'),
  transform: () => `translateY(${react.state.value}px)`,
  transitionDuration: () =>
    (react.state.value === 0 || react.state.value === -react.nowRootSize) &&
    `${isNum(react.props.duration) ? react.props.duration : DURATION}s`
})

export const seedFromBottom: Seed = react => ({
  firstRootSize: winnerHeight(),
  rootRef: createRootRef(react, 'clientHeight'),
  quit: () => react.setState({ value: react.nowRootSize }),
  canInit: touches => {
    const { touchRatio } = react.props
    const ratio = isNum(touchRatio) ? touchRatio : TOUCH_RATIO
    const reactionField = winnerHeight() * ratio
    return touches.length === 1 && touches[0].pageY < reactionField
  },
  onTouchMoveCapture: ({ touches }) => {
    const touch = touches[0]
    const { pre } = react

    if (pre.canMove()) {
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
  onTouchEndCapture: createOnTouchEndCapture(react, () => {
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

export const seedFromLeft: Seed = react => ({
  firstRootSize: -winnerWidth(),
  rootRef: createRootRef(react, 'clientWidth'),
  quit: () => react.setState({ value: -react.nowRootSize }),
  canInit: touches => {
    const { touchRatio } = react.props
    const ratio = isNum(touchRatio) ? touchRatio : TOUCH_RATIO
    const reactionField = winnerWidth() * (1 - ratio)
    return touches.length === 1 && touches[0].pageX > reactionField
  },
  onTouchMoveCapture: ({ touches }) => {
    const touch = touches[0]
    const { pre } = react

    if (pre.canMove() && pre.notScroll(touch.pageY)) {
      const nowX = react.state.value
      const diffX = touch.pageX - pre.getX()

      pre.setX(touch.pageX)
      pre.setSettle(diffX < 0 ? react.quit : react.come)
      pre.setNow()

      const nextX = nowX + diffX
      return nextX < 0
        ? react.setState({ value: nextX })
        : nowX !== 0 && react.come()
    }
  },
  onTouchEndCapture: createOnTouchEndCapture(react, () => {
    const { nowRootSize } = react
    const { value } = react.state
    const { quitRatio } = react.props
    const ratio = isNum(quitRatio) ? quitRatio : QUIT_RATIO
    return value < -(nowRootSize * ratio)
  }),
  onTransitionEnd: createOnTransitionEnd(react, 'translateX(0px)'),
  transform: () => `translateX(${react.state.value}px)`,
  transitionDuration: () =>
    (react.state.value === 0 || react.state.value === -react.nowRootSize) &&
    `${isNum(react.props.duration) ? react.props.duration : DURATION}s`
})

export const seedFromRight: Seed = react => ({
  firstRootSize: winnerWidth(),
  rootRef: createRootRef(react, 'clientWidth'),
  quit: () => react.setState({ value: react.nowRootSize }),
  canInit: touches => {
    const { touchRatio } = react.props
    const ratio = isNum(touchRatio) ? touchRatio : TOUCH_RATIO
    const reactionField = winnerWidth() * ratio
    return touches.length === 1 && touches[0].pageX < reactionField
  },
  onTouchMoveCapture: ({ touches }) => {
    const touch = touches[0]
    const { pre } = react

    if (pre.canMove() && pre.notScroll(touch.pageY)) {
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
  onTouchEndCapture: createOnTouchEndCapture(react, () => {
    const { nowRootSize } = react
    const { value } = react.state
    const { quitRatio } = react.props
    const ratio = isNum(quitRatio) ? quitRatio : QUIT_RATIO
    return value > nowRootSize * ratio
  }),
  onTransitionEnd: createOnTransitionEnd(react, 'translateX(0px)'),
  transform: () => `translateX(${react.state.value}px)`,
  transitionDuration: () =>
    (react.state.value === 0 || react.state.value === react.nowRootSize) &&
    `${isNum(react.props.duration) ? react.props.duration : DURATION}s`
})
