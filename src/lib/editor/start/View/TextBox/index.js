import getLineHeight from './getLineHeight'
import setLineHeight from './setLineHeight'
import updateTextBoxHeight from './updateTextBoxHeight'
import resetLineHeight from './resetLineHeight'
import getTextBox from './getTextBox'

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

  render(text) {
    getTextBox(this._editor[0]).innerHTML = text
  }

  updateLineHeight() {
    if (this._annotationData.span.allObjectSpans.length) {
      this.lineHeight = this._gridHeight.currentMaxHeight
    } else {
      this._resetLineHeight()
    }
  }

  _resetLineHeight() {
    resetLineHeight(this._editor[0])
    updateTextBoxHeight(this._editor[0])
  }

  forceUpdate() {
    updateTextBoxHeight(this._editor[0])
  }
}
