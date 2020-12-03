import { makeBlockSpanHTMLElementId } from '../../../idFactory'
import SELECTED from '../../../SELECTED'
import renderBackground from './renderBackground'
import renderHitArea from './renderHitArea'
import renderBlock from './renderBlock'
import setPosition from './setPosition'
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

  select() {
    const el = super.element
    el.classList.add(SELECTED)

    this._backgroundElement.classList.add(SELECTED)

    // Set focus to the span element in order to scroll the browser to the position of the element.
    el.focus()
  }

  deselect() {
    const el = super.element

    // A dom does not exist when it is deleted.
    if (el) {
      el.classList.remove(SELECTED)
    }

    if (this._backgroundElement) {
      this._backgroundElement.classList.remove(SELECTED)
    }
  }

  updateSidekicksOfBlockSpanPosition(textBox) {
    const { top, left, width, height } = this.getReactOfSidekicksOfBlock(
      textBox
    )

    setPosition(this._backgroundElement, top, left, width, height)
    setPosition(this._hitAreaElement, top, left, width, height)
  }

  renderElement(annotationBox) {
    renderBlock(this)
    // Place the background in the annotation box
    // to shift the background up by half a line from the block span area.
    renderBackground(annotationBox, this._backgroundId)

    // Add a hit area,
    // so that you can click at the same position as the background of the block span,
    // without hiding the grid in the background.
    renderHitArea(annotationBox, this, this._hitAreaId)
  }

  destroyElement() {
    super.destroyElement()
    this._backgroundElement.remove()
    this._hitAreaElement.remove()
  }

  updateGridPosition(top, left) {
    super.updateGridPosition(top, left)

    if (this._entityToFocusOn) {
      // A block span has only one entity.
      this._entityToFocusOn.select()
      this._entityToFocusOn = null
    }
  }

  get isGridPositioned() {
    return this.gridElement.style.top
  }

  set entityToFocusOn(val) {
    this._entityToFocusOn = val
  }

  getReactOfSidekicksOfBlock(textBox) {
    const rect = this._rectangle

    return {
      // Shifting up half a line from the original block position.
      top: rect.top - textBox.lineHeight / 2 + 20,
      left: rect.left - textBox.boundingClientRect.left - gapBetweenText,
      width: rect.width + gapBetweenText,
      height: rect.height
    }
  }

  get _backgroundId() {
    return `bg_of_${this.id}`
  }

  get _backgroundElement() {
    return document.querySelector(`#${this._backgroundId}`)
  }

  get _hitAreaId() {
    return `hit_area_of_${this.id}`
  }

  get _hitAreaElement() {
    return document.querySelector(`#${this._hitAreaId}`)
  }

  get _rectangle() {
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
}
