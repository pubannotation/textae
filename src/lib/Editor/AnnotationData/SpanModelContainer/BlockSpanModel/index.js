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

  updateBackgroundPosition() {
    if (this.isGridRendered) {
      const { top, left, width, height } = this._reactOfBackground
      setPosition(this._backgroundElement, top, left, width, height)

      // The div height cannot be obtained at grid rendering time,
      // so set it at move.
      this.gridElement.style.height = `${this._rectangle.height}px`
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

  get gridRectangle() {
    console.assert(this.element, 'span is not renderd')
    const { top, bottom } = this._reactOfBackground
    const { width } = this._textBox.boundingClientRect

    return {
      top: round(top),
      bottom: round(bottom),
      left: round(width - 108),
      width: 100,
      center: round(width - 58)
    }
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

  get _reactOfBackground() {
    const rect = this._rectangle
    const textBox = this._textBox

    // Shifting up half a line from the original block position.
    const top = this._shiftUpGrid(rect.top)

    return {
      top,
      bottom: top + rect.height,
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

  get _rectangle() {
    const spanElement = this.element

    // An element.offsetTop and element.offsetLeft does not work in the Firefox,
    // when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
    const rectOfSpan = spanElement.getBoundingClientRect()
    const rectOfTextBox =
      spanElement.offsetParent.offsetParent.getBoundingClientRect()

    return {
      top: rectOfSpan.top - rectOfTextBox.top,
      left: rectOfSpan.left,
      width: rectOfSpan.width,
      height: rectOfSpan.height
    }
  }

  get isGridInViewport() {
    const { clientHeight } = document.documentElement
    const { top, bottom } = this.element.getBoundingClientRect()
    return (
      0 <= this._shiftUpGrid(bottom) && this._shiftUpGrid(top) <= clientHeight
    )
  }

  _shiftUpGrid(y) {
    return y - this._textBox.lineHeight / 2 + 20
  }
}
