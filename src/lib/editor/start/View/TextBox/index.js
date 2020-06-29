import getLineHeight from './getLineHeight'
import setLineHeight from './setLineHeight'
import getCurrentMaxHeight from './getCurrentMaxHeight'
import updateTextBoxHeight from './updateTextBoxHeight'

export default class {
  constructor(editor, annotationData, typeGap) {
    this._editor = editor
    this._annotationData = annotationData
    this._typeGap = typeGap
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
      this.lineHeight = getCurrentMaxHeight(this._annotationData, this._typeGap)
    }
  }

  forceUpdate() {
    updateTextBoxHeight(this._editor[0])
  }
}
