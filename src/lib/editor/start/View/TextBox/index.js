import getLineHeight from './getLineHeight'
import setLineHeight from './setLineHeight'
import updateTextBoxHeight from './updateTextBoxHeight'
import resetLineHeight from './resetLineHeight'

export default class {
  constructor(editor, annotationData, gridHeight) {
    this._editor = editor
    this._annotationData = annotationData
    this._gridHeight = gridHeight
  }

  get lineHeight() {
    return getLineHeight(this._editor[0])
  }

  set lineHeight(val) {
    setLineHeight(this._editor[0], val)
    updateTextBoxHeight(this._editor[0])
  }

  updateLineHeight() {
    if (this._annotationData.span.all.length) {
      this.lineHeight = this._gridHeight.currentMaxHeight
    } else {
      this._resetLineHeight()
    }
  }

  _resetLineHeight() {
    const editor = this._editor[0]
    resetLineHeight(editor)
  }

  forceUpdate() {
    updateTextBoxHeight(this._editor[0])
  }
}
