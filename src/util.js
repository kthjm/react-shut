// @flow
export const BACKGROUND = 'rgb(251, 251, 251)'
export const DURATION = '0.4s'
export const TOUCH_RATIO = 0.4
export const QUIT_RATIO = 0.6

export const isFn = target => typeof target === 'function'

export const RootRef = (react, key) =>
  function(target) {
    if (target && !react.rootSize) {
      react.rootSize = () => target[key]
    }
  }

export const OnTouchEnd = (react, quitCondition) => () => {
  if (react.pre.active) {
    const { pre, nowRootSize } = react
    const { quitRatio } = react.props
    const { value } = react.state

    const settle =
      Date.now() - pre.getNow() < 26
        ? pre.getSettle()
        : quitCondition() ? react.quit : react.come

    settle()
    pre.kill()
  }
}

export const OnTransitionEnd = (react, onComeKey) => e => {
  if (e.target === e.currentTarget) {
    const onCuit =
      e.currentTarget.style.transform === onComeKey
        ? react.props.onCome
        : react.props.onQuit

    return isFn(onCuit) && onCuit(e)
  }
}
