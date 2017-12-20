// @flow
type RootRef$Target = { clientWidth: number, clientHeight: number }
export type RootRef = (target: RootRef$Target) => void
export type GetRootSize = () => number
export type GetRootWidth = () => number
export type Come = () => void
export type Quit = () => void
export type CanInit = (touches: Array<Touch>) => boolean
export type OnTouchMoveCapture = (e: SyntheticTouchEvent<*>) => void | false
export type OnTouchEndCapture = (e: SyntheticTouchEvent<*>) => void
export type OnTransitionEnd = (
  e: SyntheticTransitionEvent<HTMLDivElement>,
  persisted?: boolean
) => void
export type Transform = () => string
export type TransitionDuration = () => false | string

type Unique = {
  firstRootSize: number,
  rootRef: RootRef,
  quit: Quit,
  canInit: CanInit,
  onTouchMoveCapture: OnTouchMoveCapture,
  onTouchEndCapture: OnTouchEndCapture,
  onTransitionEnd: OnTransitionEnd,
  transform: Transform,
  transitionDuration: TransitionDuration
}

export type Seed = (react: *) => Unique
