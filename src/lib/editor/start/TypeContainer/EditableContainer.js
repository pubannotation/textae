import Container from './Container'

export default class extends Container {
  constructor(getAllInstanceFunc, defaultColor, lockStateObservable) {
    super(getAllInstanceFunc, defaultColor)
    this.lockStateObservable = lockStateObservable

    lockStateObservable(() => super.emit('type.lock'))
  }

  get isLock() {
    return this.lockStateObservable()
  }
}
