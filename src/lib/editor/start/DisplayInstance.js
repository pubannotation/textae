import Observable from 'observ'
export default class DisplayInstance {
  constructor() {
    // The typeGap is changed from the Setting dialog or
    // by changing mode showing or not showing instances.
    this._typeGap = new Observable({
      value: -1,
      showInstance: false
    })

    this._isModeShowingInstance = true
    this._valueForModeShowingInstance = 2
  }

  bind(callback) {
    this._typeGap(callback)
  }

  show() {
    this._isModeShowingInstance = true
    this._typeGap.set({
      value: this._valueForModeShowingInstance,
      showInstance: true
    })
  }

  hide() {
    this._isModeShowingInstance = false
    this._typeGap.set({
      value: 0,
      showInstance: false
    })
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
    this._typeGap.set({
      value: val,
      showInstance: true
    })
  }
}
