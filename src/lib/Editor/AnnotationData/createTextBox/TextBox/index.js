import getLineHeight from './getLineHeight'
import setLineHeight from './setLineHeight'
import updateTextBoxHeight from './updateTextBoxHeight'
import pixelToInt from './pixelToInt'

export default class TextBox {
  constructor(editorHTMLElement, annotationData, updatePosition) {
    this._editorHTMLElement = editorHTMLElement
    this._el = editorHTMLElement.querySelector('.textae-editor__text-box')
    this._annotationData = annotationData
    this._updatePosition = updatePosition
  }

  get boundingClientRect() {
    return this._el.getBoundingClientRect()
  }

  get lineHeight() {
    return getLineHeight(this._el)
  }

  set lineHeight(val) {
    setLineHeight(this._el, val)
    this.forceUpdate()
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
    this._updatePosition()
  }

  _resetLineHeight() {
    // The default line height follows the editor's line height.
    const { lineHeight } = window.getComputedStyle(this._editorHTMLElement)
    this.lineHeight = pixelToInt(lineHeight)
  }

  _updateSizeOfRelationBox() {
    const relationBox = this._editorHTMLElement.querySelector(
      '.textae-editor__relation-box'
    )
    relationBox.style.height = this._el.style.height
    relationBox.style.width = window.getComputedStyle(this._el).width
  }
}
