import Container from './Container'

export default class extends Container {
  constructor(getAllInstanceFunc, defaultColor, getLockStateFunc) {
    super(getAllInstanceFunc, defaultColor)
    this.getLockState = getLockStateFunc
  }

  get isLock() {
    return this.getLockState()
  }
}
