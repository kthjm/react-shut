// @flow
const DURATION = '0.4s'
const TOUCH_RATIO = 0.4
const QUIT_RAIO = 0.6

const mapByFrom = new Map()

mapByFrom.set('right', react => ({
  firstRootSize: window.innerWidth,

  rootRef: RootRef(react, 'clientWidth'),

  quit: () => react.setState({ value: react.nowRootSize }),

  transform: () => `translateX(${react.state.value}px)`,

  transitionDuration: () =>
    ((react.state.value === 0 || react.state.value === react.nowRootSize) &&
      react.props.duration) ||
    DURATION,

  canInit: touches => {
    const touchRatio = react.props.touchRatio || TOUCH_RATIO
    const reactionField = react.nowRootSize * touchRatio
    return touches.length === 1 && touches[0].pageX < reactionField
  },

  onTouchMove: () => {
    const touch = touches[0]
    const { pre } = react

    if (pre.active && !pre.isScroll(touch.pageY)) {
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

  onTransitionEnd: OnTransitionEnd(react, 'translateX(0px)')
}))

function RootRef(react, key) {
  return function(target) {
    if (target && !react.rootSize) {
      react.rootSize = () => target[key]
    }
  }
}

function OnTransitionEnd(react, key) {
  return e => {
    if (e.target === e.currentTarget) {
      const onCuit =
        e.currentTarget.style.transform === onComeKey
          ? react.props.onCome
          : react.props.onQuit

      return isFn(onCuit) && onCuit(e)
    }
  }
}

export default mapByFrom

// import {
//   // DURATION,
//   // BACKGROUND,
//   // TOUCH_RATIO,
//   // QUIT_RAIO,
//   // lag,
//   // isFn,
//   // RootRef,
//   // OnTransitionEnd
// } from "./util.js"
// {
//   const { value } = react.state
//   const { nowRootSize } = react
//   const duration = react.props.duration || DURATION
//   return (value === 0 || value === nowRootSize) && (duration || DURATION)
// }
// function OnTouchStart(react){
//   return ({ touches }) =>
//     react.canInit(touches) &&
//     react.pre.init(touches[0])
// }
