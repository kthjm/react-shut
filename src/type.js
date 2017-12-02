// @flow
type RootRef$Target = { clientWidth: number, clientHeight: number }
export type RootRef = (target: RootRef$Target) => void
export type RootSize = () => number
export type Come = () => void
export type Quit = () => void
export type CanInit = (touches: Array<Touch>) => boolean
export type OnTouchMove = (e: SyntheticTouchEvent<*>) => void | false
export type OnTouchEnd = (e: SyntheticTouchEvent<*>) => void
export type OnTransitionEnd = (e: SyntheticTransitionEvent<*>) => void | false
export type Transform = () => string
export type TransitionDuration = () => false | string

type Unique = {
  firstRootSize: number,
  rootRef: RootRef,
  quit: Quit,
  canInit: CanInit,
  onTouchMove: OnTouchMove,
  onTouchEnd: OnTouchEnd,
  onTransitionEnd: OnTransitionEnd,
  transform: Transform,
  transitionDuration: TransitionDuration
}

export type Seed = (react: *) => Unique
