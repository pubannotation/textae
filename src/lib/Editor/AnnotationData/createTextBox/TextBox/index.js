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

    // When determining the width of one editor, vertical scroll bars are not needed,
    // and when annotations are loaded in another editor and vertical scroll bars appear,
    // the original editor is not wide enough and horizontal scroll bars appear.
    // Reduce the size of the relational display area to prevent horizontal scroll bars from appearing.
    // Why not resize the editor?
    // It is not possible to detect that a scroll bar has been displayed, so a notification is needed to change the height of the editor.
    // The editor does not have a notification mechanism.
    // It would be a big step to add a notification mechanism for this purpose.
    const width = parseFloat(window.getComputedStyle(this._el).width)
    relationBox.style.width = `${width - 10}px`
  }
}
