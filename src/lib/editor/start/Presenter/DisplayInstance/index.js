import TypeGapCache from './TypeGapCache'
import event from '../EditMode/event'
import toastr from 'toastr'
import changeTypeGap from './changeTypeGap'
import updateTypeGap from './updateTypeGap'

export default class {
  constructor(typeGap, editMode) {
    this._showInstance = true
    this._typeGapCache = new TypeGapCache()

    editMode
      .on(event.SHOW, () => {
        this._showInstance = true
        updateTypeGap(this._showInstance, typeGap, this._typeGapCache)
      })
      .on(event.HIDE, () => {
        this._showInstance = false
        updateTypeGap(this._showInstance, typeGap, this._typeGapCache)
      })

    this._typeGap = typeGap
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
