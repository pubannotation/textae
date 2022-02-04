import getLineHeight from './getLineHeight'
import setLineHeight from './setLineHeight'
import updateTextBoxHeight from './updateTextBoxHeight'
import pixelToInt from './pixelToInt'

export default class TextBox {
  constructor(editor, annotationData) {
    this._editor = editor
    this._el = editor.querySelector('.textae-editor__text-box')
    this._annotationData = annotationData
  }

  get boundingClientRect() {
    return this._el.getBoundingClientRect()
  }

  get lineHeight() {
    return getLineHeight(this._el)
  }

  set lineHeight(val) {
    setLineHeight(this._el, val)
    updateTextBoxHeight(this._el)
    this._updateSizeOfRelationBox()
  }

  render(text) {
    this._el.innerHTML = text
  }

  updateLineHeight() {
    const lineHeight = this._annotationData.span.maxHeight

    if (lineHeight) {
      this.lineHeight = lineHeight
    } else {
      this._resetLineHeight()
    }
  }

  forceUpdate() {
    updateTextBoxHeight(this._el)
    this._updateSizeOfRelationBox()
  }

  _resetLineHeight() {
    // The default line height follows the editor's line height.
    const { lineHeight } = window.getComputedStyle(this._editor)
    this.lineHeight = pixelToInt(lineHeight)
  }

  _updateSizeOfRelationBox() {
    const relationBox = this._editor.querySelector(
      '.textae-editor__relation-box'
    )
    relationBox.style.height = this._el.style.height
    relationBox.style.width = window.getComputedStyle(this._el).width
  }
}
