// @flow
import { type Come, type Quit } from './type.js'

type Pre$State = {
  now: number,
  x: number,
  y: number,
  doneCheckScroll: boolean,
  settle?: Come | Quit
}

const now = (): number => Date.now()
const FORCE_DIFF = 26

export default class Pre {
  state: any | Pre$State

  active() {
    return Boolean(this.state) && typeof this.state === 'object'
  }

  init(touch: Touch) {
    this.state = {
      now: now(),
      x: touch.pageX,
      y: touch.pageY,
      doneCheckScroll: false,
      settle: undefined
    }
  }

  notScroll(compareY: number) {
    if (!this.state.doneCheckScroll) {
      const diffY = compareY - this.state.y
      if (diffY > 10 || diffY < -10) {
        return this.kill()
      }
      this.state.doneCheckScroll = true
    }
    return true
  }

  setX(x: number) {
    this.state.x = x
  }
  getX() {
    return this.state.x
  }

  setY(y: number) {
    this.state.y = y
  }
  getY() {
    return this.state.y
  }

  setSettle(f: Come | Quit) {
    this.state.settle = f
  }
  getSettle() {
    const { settle } = this.state
    return (
      now() - this.getNow() < FORCE_DIFF &&
      typeof settle === 'function' &&
      settle
    )
  }

  setNow() {
    this.state.now = now()
  }
  getNow() {
    return this.state.now
  }

  kill() {
    this.state = null
  }
}
