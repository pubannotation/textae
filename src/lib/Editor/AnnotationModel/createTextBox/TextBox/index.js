import getLineHeight from './getLineHeight'
import setLineHeight from './setLineHeight'
import updateTextBoxHeight from './updateTextBoxHeight'
import pixelToInt from './pixelToInt'

export default class TextBox {
  #editorHTMLElement
  #el
  #annotationModel

  constructor(editorHTMLElement, annotationModel) {
    this.#editorHTMLElement = editorHTMLElement
    this.#el = editorHTMLElement.querySelector('.textae-editor__text-box')
    this.#annotationModel = annotationModel
  }

  get boundingClientRect() {
    return this.#el.getBoundingClientRect()
  }

  get lineHeight() {
    return getLineHeight(this.#el)
  }

  set lineHeight(val) {
    setLineHeight(this.#el, val)
    this.forceUpdate()
    this.#annotationModel.updatePosition()
  }

  render(text) {
    // https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
    this.#el.innerHTML = text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;')
  }

  updateLineHeight() {
    const lineHeight = this.#annotationModel.span.maxHeight

    if (lineHeight) {
      this.lineHeight = lineHeight
    } else {
      this.#resetLineHeight()
    }
  }

  forceUpdate() {
    updateTextBoxHeight(this.#el)
    this.#updateSizeOfRelationBox()
  }

  #resetLineHeight() {
    // The default line height follows the editor's line height.
    const { lineHeight } = window.getComputedStyle(this.#editorHTMLElement)
    this.lineHeight = pixelToInt(lineHeight)
  }

  #updateSizeOfRelationBox() {
    const relationBox = this.#editorHTMLElement.querySelector(
      '.textae-editor__relation-box'
    )
    relationBox.style.height = this.#el.style.height

    // When determining the width of one editor, vertical scroll bars are not needed,
    // and when annotations are loaded in another editor and vertical scroll bars appear,
    // the original editor is not wide enough and horizontal scroll bars appear.
    // Reduce the size of the relational display area to prevent horizontal scroll bars from appearing.
    // Why not resize the editor?
    // It is not possible to detect that a scroll bar has been displayed, so a notification is needed to change the height of the editor.
    // The editor does not have a notification mechanism.
    // It would be a big step to add a notification mechanism for this purpose.
    const width = parseFloat(window.getComputedStyle(this.#el).width)
    relationBox.style.width = `${width - 10}px`
  }
}
