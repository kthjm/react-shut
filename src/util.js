// @flow
export const DURATION = '0.4s'
export const TOUCH_RATIO = 0.4
export const QUIT_RAIO = 0.6

export const isFn = target => typeof target === 'function'

export const RootRef = (react, key) =>
  function(target) {
    if (target && !react.rootSize) {
      react.rootSize = () => target[key]
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
