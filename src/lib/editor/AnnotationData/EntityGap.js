export default class EntityGap {
  constructor(callback) {
    // The typeGap is changed from the Setting dialog or
    // by changing mode showing or not showing instances.
    this._isGapShown = true
    this._numberOfGap = 2
    this._callback = callback
  }

  set show(val) {
    this._isGapShown = val
    this._callback(this.value)
  }

  get show() {
    return this._isGapShown
  }

  get value() {
    return this._isGapShown ? this._numberOfGap : 0
  }

  // The typeGap be able to be changed when mode showing instances.
  set value(val) {
    this._numberOfGap = val
    this._callback(val)
  }
}
