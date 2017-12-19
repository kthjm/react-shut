// @flow
import {
  type RootRef,
  type GetRootSize,
  type GetRootWidth,
  type OnTouchEnd,
  type OnTransitionEnd
} from './type.js'

export const BACKGROUND = 'rgb(251, 251, 251)'
export const DURATION = 0.4
export const TOUCH_RATIO = 0.4
export const QUIT_RATIO = 0.6

export const winnerWidth = (): number => window.innerWidth
export const winnerHeight = (): number => window.innerHeight
export const isFnc = (target: any): boolean => typeof target === 'function'
export const isNum = (target: any): boolean => typeof target === 'number'

export const createRootRef = (
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

export const createOnTouchEnd = (
  react: *,
  quitCondition: () => boolean
): OnTouchEnd => () => {
  const { pre } = react

  if (pre.active()) {
    const settle =
      pre.getSettle() || (quitCondition() ? react.quit : react.come)
    settle()
    pre.kill()
  }
}

export const createOnTransitionEnd = (
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
