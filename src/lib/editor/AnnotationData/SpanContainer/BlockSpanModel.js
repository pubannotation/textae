import { makeBlockSpanHtmlelementId } from '../../idFactory'
import SpanModel from './SpanModel'

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
    return makeBlockSpanHtmlelementId(this._editor, this._begin, this._end)
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
}
