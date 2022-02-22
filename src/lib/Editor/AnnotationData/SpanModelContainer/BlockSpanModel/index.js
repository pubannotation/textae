import { makeBlockSpanHTMLElementID } from '../../../idFactory'
import SELECTED from '../SELECTED'
import renderBackground from './renderBackground'
import setPosition from './setPosition'
import SpanModel from '../SpanModel'
import round from '../round'
import getAnnotationBox from '../../getAnnotationBox'

// Leave a gap between the text and the block border.
const gapBetweenText = 8
export default class BlockSpanModel extends SpanModel {
  /**
   *
   * @param {import('../../createTextBox/TextBox').default} textBox
   */
  constructor(
    editorID,
    editorHTMLElement,
    begin,
    end,
    entityModelContainer,
    spanModelContainer,
    textBox
  ) {
    super(editorID, editorHTMLElement, begin, end, spanModelContainer)
    this._entityModelContainer = entityModelContainer
    this._textBox = textBox
  }

  // Utility to distinguish with otehr type spans.
  get isBlock() {
    return true
  }

  passesAllEntitiesTo(newSpan) {
    for (const entity of this.entities) {
      entity.span = newSpan
    }
  }

  get id() {
    return makeBlockSpanHTMLElementID(this._editorID, this._begin, this._end)
  }

  select() {
    super.select()

    const el = super.element
    el.classList.add(SELECTED)

    this._backgroundElement.classList.add(SELECTED)

    // Set focus to the span element in order to scroll the browser to the position of the element.
    el.focus()
  }

  deselect() {
    super.deselect()

    const el = super.element

    // A dom does not exist when it is deleted.
    if (el) {
      el.classList.remove(SELECTED)
    }

    if (this._backgroundElement) {
      this._backgroundElement.classList.remove(SELECTED)
    }
  }

  updateBackgroundPosition() {
    if (this.isGridRendered) {
      const height = this._height
      const { top, left, width } = this._reactOfBackground
      setPosition(this._backgroundElement, top, left, width, height)

      // The div height cannot be obtained at grid rendering time,
      // so set it at move.
      this.gridElement.style.height = `${height}px`
    }
  }

  renderElement() {
    super.renderElement()

    // Place the background in the annotation box
    // to shift the background up by half a line from the block span area.
    const annotationBox = getAnnotationBox(this._editorHTMLElement)
    renderBackground(annotationBox, this._backgroundId)
  }

  destroyElement() {
    super.destroyElement()
    this._backgroundElement.remove()
  }

  get heightIncludeDescendantGrids() {
    return super.gridHeight + 35
  }

  get widthOfGrid() {
    return 100
  }

  get centerOfGrid() {
    const { width } = this._textBox.boundingClientRect
    return round(width - 58)
  }

  get topOfGrid() {
    const { top } = this._reactOfBackground
    return round(top)
  }

  get bottomOfGrid() {
    const { bottom } = this._reactOfBackground
    return round(bottom)
  }

  get leftOfGrid() {
    const { width } = this._textBox.boundingClientRect

    return round(width - 108)
  }

  updateGridPosition() {
    super.updateGridPosition()

    if (this._entityToFocusOn) {
      // A block span has only one entity.
      this._entityToFocusOn.select()
      this._entityToFocusOn = null
    }
  }

  get isGridBeforePositioned() {
    return !this.gridElement.style.top
  }

  set entityToFocusOn(val) {
    this._entityToFocusOn = val
  }

  isGridInViewport(clientHeight) {
    return this._isGridInViewPort(clientHeight, 0)
  }

  isGridInDrawArea(clientHeight) {
    return this._isGridInViewPort(clientHeight, clientHeight)
  }

  get _reactOfBackground() {
    const rectOfSpan = this.element.getBoundingClientRect()
    const textBox = this._textBox

    // Shifting up half a line from the original block position.
    const top = this._shiftUpGrid(
      rectOfSpan.top - textBox.boundingClientRect.top
    )

    return {
      top,
      bottom: top + this._height,
      left: rectOfSpan.left - textBox.boundingClientRect.left - gapBetweenText,
      width: this.element.getBoundingClientRect().width + gapBetweenText
    }
  }

  get _backgroundId() {
    return `bg_of_${this.id}`
  }

  get _backgroundElement() {
    return document.querySelector(`#${this._backgroundId}`)
  }

  get _height() {
    return this.element.getBoundingClientRect().height
  }

  get _rectangle() {
    const spanElement = this.element

    // An element.offsetTop and element.offsetLeft does not work in the Firefox,
    // when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
    const rectOfSpan = spanElement.getBoundingClientRect()
    const rectOfTextBox =
      spanElement.offsetParent.offsetParent.getBoundingClientRect()

    return {
      top: rectOfSpan.top - rectOfTextBox.top
    }
  }

  _isGridInViewPort(clientHeight, margin) {
    const { top, bottom } = this.element.getBoundingClientRect()
    return (
      0 - margin <= this._shiftUpGrid(bottom) &&
      this._shiftUpGrid(top) <= clientHeight + margin
    )
  }

  _shiftUpGrid(y) {
    return y - this._textBox.lineHeight / 2 + 20
  }

  get _contentHTML() {
    return `<div id="${this.id}" class="textae-editor__block"></div>`
  }

  _createGridElement() {
    const el = super._createGridElement()
    el.classList.add('textae-editor__block-hit-area')
    el.dataset.id = this.id
    el.title = this.title
    return el
  }
}
