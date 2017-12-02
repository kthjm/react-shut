// @flow
import {
  type RootRef,
  type RootSize,
  type OnTouchEnd,
  type OnTransitionEnd
} from './type.js'

export const BACKGROUND = 'rgb(251, 251, 251)'
export const DURATION = '0.4s'
export const TOUCH_RATIO = 0.4
export const QUIT_RATIO = 0.6

export const winnerWidth = (): number => window.innerWidth
export const winnerHeight = (): number => window.innerHeight
export const isFn = (target: any): boolean => typeof target === 'function'

export const createRootRef = (
  react: *,
  key: 'clientWidth' | 'clientHeight'
): RootRef =>
  function(target) {
    if (target && !react.rootSize) {
      const rootSize: RootSize = () => target[key]
      react.rootSize = rootSize
    }
  }

export const createOnTouchEnd = (
  react: *,
  quitCondition: () => boolean
): OnTouchEnd => () => {
  const { pre } = react

  if (pre.active()) {
    const settle =
      Date.now() - pre.getNow() < 26
        ? pre.getSettle()
        : quitCondition() ? react.quit : react.come

    settle()
    pre.kill()
  }
}

export const createOnTransitionEnd = (
  react: *,
  onComeKey: 'translateX(0px)' | 'translateY(0px)'
): OnTransitionEnd => e => {
  ;(e.currentTarget: HTMLDivElement)
  if (e.target === e.currentTarget) {
    const onCuit =
      e.currentTarget.style.transform === onComeKey
        ? react.props.onCome
        : react.props.onQuit

    return onCuit && isFn(onCuit) && onCuit(e)
  }
}
