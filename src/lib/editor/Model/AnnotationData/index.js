import reset from './reset'
import toJson from './toJson'
import Container from './Container'

export default class extends Container {
  constructor(editor) {
    super(editor)
  }

  reset(annotation) {
    reset(this, annotation)
  }

  resetOnlyConfig() {
    super.emit('config.change', this)
  }

  toJson() {
    return toJson(this)
  }

  getModificationOf(objectId) {
    return this.modification.all.filter((m) => m.obj === objectId)
  }
}
