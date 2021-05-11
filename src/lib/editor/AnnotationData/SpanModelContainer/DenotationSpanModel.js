import SELECTED from '../../SELECTED'
import getHeightIncludeDescendantGrids from './getHeightIncludeDescendantGrids'
import round from './round'
import SpanModel from './SpanModel'

const TEXT_HEIGHT = 23
const MARGIN_TOP = 30
export default class DenotationSpanModel extends SpanModel {
  constructor(editor, begin, end, entityModelContainer, spanModelContainer) {
    super(editor, begin, end, spanModelContainer)
    this._entityModelContainer = entityModelContainer
  }

  get entities() {
    return this._entityModelContainer.getAllOfSpan(this)
  }

  passesAllEntitiesTo(newSpan) {
    for (const entity of this.entities) {
      entity.span = newSpan
    }
  }

  get hasStyle() {
    return this.styles.size > 0
  }

  // Merges a span and a typesetting so that it can be rendered as a single DOM element.
  get styles() {
    return this._spanModelContainer.getStyle(this.id)
  }

  get rectangle() {
    const spanElement = this.element

    // An element.offsetTop and element.offsetLeft does not work in the Firefox,
    // when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
    const rectOfSpan = spanElement.getBoundingClientRect()
    const rectOfTextBox =
      spanElement.offsetParent.offsetParent.getBoundingClientRect()

    return {
      top: rectOfSpan.top - rectOfTextBox.top,
      left: rectOfSpan.left - rectOfTextBox.left,
      width: rectOfSpan.width
    }
  }

  get isDenotation() {
    return true
  }

  select() {
    const el = super.element
    el.classList.add(SELECTED)

    // Set focus to the span element in order to scroll the browser to the position of the element.
    el.focus()
  }

  deselect() {
    const el = super.element

    // A dom does not exist when it is deleted.
    if (el) {
      el.classList.remove(SELECTED)
    }
  }

  getHeightIncludeDescendantGrids(typeGap) {
    return (
      getHeightIncludeDescendantGrids(this, typeGap) + TEXT_HEIGHT + MARGIN_TOP
    )
  }

  get _contentHTML() {
    return `
      <span
        id="${this.id}"
        title="${this.title}"
        tabindex="0"
        class="${['textae-editor__span'].concat(this._styleClasses).join(' ')}"
        >
      </span>
    `
  }

  get _gridRectangle() {
    console.assert(this.element, 'span is not renderd')
    const { top, left, width } = this.rectangle

    return {
      width: round(width),
      top: round(
        top -
          getHeightIncludeDescendantGrids(
            this,
            this._spanModelContainer._entityGap.value
          )
      ),
      left: round(left)
    }
  }
}
