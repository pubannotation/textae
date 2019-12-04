import TypeGapCache from './TypeGapCache'
import toastr from 'toastr'
import changeTypeGap from './changeTypeGap'
import updateTypeGap from './updateTypeGap'

export default class {
  constructor(typeGap) {
    this._typeGap = typeGap
    this._showInstance = true
    this._typeGapCache = new TypeGapCache()
  }

  show() {
    this._showInstance = true
    updateTypeGap(this._showInstance, this._typeGap, this._typeGapCache)
  }

  hide() {
    this._showInstance = false
    updateTypeGap(this._showInstance, this._typeGap, this._typeGapCache)
  }

  get showInstance() {
    return this._showInstance
  }

  get typeGap() {
    return this._typeGap().value
  }

  set typeGap(val) {
    changeTypeGap(this._showInstance, this._typeGap, this._typeGapCache, val)
  }

  notifyNewInstance() {
    if (!this._showInstance) {
      toastr.success('an instance is created behind.')
    }
  }
}
