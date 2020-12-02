export default class DisplayInstance {
  constructor() {
    // The typeGap is changed from the Setting dialog or
    // by changing mode showing or not showing instances.
    this._typeGap = -1
    this._isModeShowingInstance = true
    this._valueForModeShowingInstance = 2
  }

  bind(callback) {
    this._callback = callback
  }

  show() {
    this._isModeShowingInstance = true
    this._typeGap = this._valueForModeShowingInstance
    this._callback(this._valueForModeShowingInstance)
  }

  hide() {
    this._isModeShowingInstance = false
    this._typeGap = 0
    this._callback(0)
  }

  get showInstance() {
    return this._isModeShowingInstance
  }

  get typeGap() {
    return this._isModeShowingInstance ? this._valueForModeShowingInstance : 0
  }

  // The typeGap be able to be changed when mode showing instances.
  set typeGap(val) {
    this._valueForModeShowingInstance = val
    this._typeGap = val
    this._callback(val)
  }
}
