export default class DisplayInstance {
  constructor() {
    // The typeGap is changed from the Setting dialog or
    // by changing mode showing or not showing instances.
    this._isInstanceShown = true
    this._typeGap = 2
  }

  bind(callback) {
    this._callback = callback
  }

  show() {
    this._isInstanceShown = true
    this._callback(this._typeGap)
  }

  hide() {
    this._isInstanceShown = false
    this._callback(0)
  }

  get showInstance() {
    return this._isInstanceShown
  }

  get typeGap() {
    return this._isInstanceShown ? this._typeGap : 0
  }

  // The typeGap be able to be changed when mode showing instances.
  set typeGap(val) {
    this._typeGap = val
    this._callback(val)
  }
}
