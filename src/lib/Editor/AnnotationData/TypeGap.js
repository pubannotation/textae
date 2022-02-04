export default class TypeGap {
  constructor(callback) {
    // The typeGap is changed from the Setting dialog or
    // by changing mode showing or not showing instances.
    this._isGapShown = true
    this._numberOfGap = 1
    this._callback = callback
  }

  set show(val) {
    if (this._isGapShown !== val) {
      this._isGapShown = val
      this._callback(this.value)
    }
  }

  get show() {
    return this._isGapShown
  }

  get value() {
    return this._isGapShown ? this._numberOfGap : 0
  }

  get height() {
    const typeGapUnitHeight = 24

    return this.value * typeGapUnitHeight
  }

  // The typeGap be able to be changed when mode showing instances.
  set value(val) {
    if (this._numberOfGap !== val) {
      this._numberOfGap = val
      this._callback(val)
    }
  }
}
