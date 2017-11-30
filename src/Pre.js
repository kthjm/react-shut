// @flow
export default class Pre {
  constructor() {
    this.active = false
  }

  init(touch) {
    this.state = {
      now: Date.now(),
      x: touch.pageX,
      y: touch.pageY,
      doneCheckScroll: false,
      settle: undefined
    }

    this.active = true
  }

  isScroll(compareY) {
    if (!this.state.doneCheckScroll) {
      const diffY = compareY - this.state.y

      if (diffY > 10 || diffY < -10) {
        this.kill()
        return true
      } else {
        this.state.doneCheckScroll = true
      }
    }
  }

  setX(x) {
    this.state.x = x
  }
  getX() {
    return this.state.x
  }

  setY(y) {
    this.state.y = y
  }
  getY() {
    return this.state.y
  }

  setSettle(f) {
    this.state.settle = f
  }
  getSettle() {
    return this.state.settle
  }

  setNow() {
    this.state.now = Date.now()
  }
  getNow() {
    return this.state.now
  }

  kill() {
    this.state = null
    this.active = false
  }
}
