import reset from './reset'
import toJson from './toJson'
import Container from './Container'

export default class extends Container {
  constructor(editor) {
    super(editor)
    this._editor = editor
  }

  reset(annotation) {
    reset(this, this._editor, annotation)
  }

  toJson() {
    return toJson(this)
  }

  getModificationOf(objectId) {
    return this.modification.all.filter((m) => m.obj === objectId)
  }
}
