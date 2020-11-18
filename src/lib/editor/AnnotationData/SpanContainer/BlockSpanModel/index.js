import { makeBlockSpanHTMLElementId } from '../../../idFactory'
import SELECTED from '../../../SELECTED'
import renderBackgroundOfBlockSpan from './renderBackgroundOfBlockSpan'
import renderBlock from './renderBlock'
import SpanModel from '../SpanModel'

// Leave a gap between the text and the block border.
const gapBetweenText = 8
export default class BlockSpanModel extends SpanModel {
  constructor(editor, begin, end, entityContainer, spanContainer) {
    super(editor, begin, end, spanContainer)
    this._entityContainer = entityContainer
  }

  // Utility to distinguish with otehr type spans.
  get isBlock() {
    return true
  }

  get entities() {
    return this._entityContainer.getAllOfSpan(this)
  }

  get id() {
    return makeBlockSpanHTMLElementId(this._editor, this._begin, this._end)
  }

  get rectangle() {
    const spanElement = this.element

    // An element.offsetTop and element.offsetLeft does not work in the Firefox,
    // when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
    const rectOfSpan = spanElement.getBoundingClientRect()
    const rectOfTextBox = spanElement.offsetParent.offsetParent.getBoundingClientRect()

    return {
      top: rectOfSpan.top - rectOfTextBox.top,
      left: rectOfSpan.left,
      width: rectOfSpan.width,
      height: rectOfSpan.height
    }
  }

  get backgroundId() {
    return `bg_of_${this.id}`
  }

  get backgroundElement() {
    return document.querySelector(`#${this.backgroundId}`)
  }

  select() {
    const el = super.element
    el.classList.add(SELECTED)

    this.backgroundElement.classList.add(SELECTED)

    // Set focus to the span element in order to scroll the browser to the position of the element.
    el.focus()
  }

  deselect() {
    const el = super.element

    // A dom does not exist when it is deleted.
    if (el) {
      el.classList.remove(SELECTED)
    }

    if (this.backgroundElement) {
      this.backgroundElement.classList.remove(SELECTED)
    }
  }

  updateBackgroundOfBlockSpanPosition(textBox) {
    const bg = this.backgroundElement
    const rect = this.rectangle

    bg.style.top = `${rect.top - textBox.lineHeight / 2 + 20}px`
    bg.style.left = `${
      rect.left - textBox.boundingClientRect.left - gapBetweenText
    }px`
    bg.style.width = `${rect.width + gapBetweenText}px`
    bg.style.height = `${rect.height}px`
  }

  renderElement(annotationBox) {
    renderBlock(this)
    // Place the background in the annotation box
    // to shift the background up by half a line from the block span area.
    renderBackgroundOfBlockSpan(annotationBox, this)
  }

  destroyElement() {
    super.destroyElement()
    this.backgroundElement.remove()
  }
}
