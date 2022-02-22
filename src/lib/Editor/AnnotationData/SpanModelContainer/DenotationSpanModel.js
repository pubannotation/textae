import SELECTED from './SELECTED'
import getGridHeightIncludeDescendantGrids from './getGridHeightIncludeDescendantGrids'
import round from './round'
import SpanModel from './SpanModel'
import isTouchable from '../../isTouchable'
import { makeDenotationSpanHTMLElementID } from '../../idFactory'

const TEXT_HEIGHT = 23
const MARGIN_TOP = 30
export default class DenotationSpanModel extends SpanModel {
  constructor(
    editorID,
    editorHTMLElement,
    begin,
    end,
    entityModelContainer,
    spanModelContainer
  ) {
    super(editorID, editorHTMLElement, begin, end, spanModelContainer)
    this._entityModelContainer = entityModelContainer
  }

  get id() {
    return makeDenotationSpanHTMLElementID(
      this._editorID,
      this._begin,
      this._end
    )
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

    const left = rectOfSpan.left - rectOfTextBox.left

    // To fix the position of the toolbar, we use position: sticky.
    // On Android chrome, if an element is drawn at a position that is out of the device width,
    // the sticky position will be shifted upward by the width of the overhang.
    // To prevent this, the grid is not drawn outside the text box.
    const width = isTouchable()
      ? Math.min(rectOfSpan.width, rectOfTextBox.width - left)
      : rectOfSpan.width

    return {
      top: rectOfSpan.top - rectOfTextBox.top,
      left,
      width
    }
  }

  get isDenotation() {
    return true
  }

  addEntityElementToGridElement(entityElement) {
    super.addEntityElementToGridElement(entityElement)
    this.updateSelfAndAncestorsGridPosition()
  }

  updateSelfAndAncestorsGridPosition() {
    this.updateGridPosition()
    let parentSpan = this.parent
    while (parentSpan instanceof DenotationSpanModel) {
      parentSpan.updateGridPosition()
      parentSpan = parentSpan.parent
    }
  }

  updateDenotationEntitiesWidth() {
    if (this.isGridRendered) {
      const { width } = this.gridRelativeRectangle
      this.gridElement.style.width = `${width}px`
    }
  }

  select() {
    super.select()

    const el = super.element
    el.classList.add(SELECTED)

    // Set focus to the span element in order to scroll the browser to the position of the element.
    // Focusing the span with the mouseup event on the context menu
    // will trigger the textae-editor click event in the Chrome browser on Android.
    // This will trigger the body click event, which will deselect the span.
    // To prevent this, we will focus the span in the next event loop cycle.
    setTimeout(() => el.focus(), 0)
  }

  deselect() {
    super.deselect()

    const el = super.element

    // A dom does not exist when it is deleted.
    if (el) {
      el.classList.remove(SELECTED)
    }
  }

  get heightIncludeDescendantGrids() {
    return getGridHeightIncludeDescendantGrids(this) + TEXT_HEIGHT + MARGIN_TOP
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

  get gridRelativeRectangle() {
    console.assert(this.element, 'span is not renderd')
    const { top, left, width } = this.rectangle

    return {
      top: round(top - getGridHeightIncludeDescendantGrids(this)),
      left: round(left),
      width: round(width),
      center: round(left + width / 2)
    }
  }

  isGridInViewport(clientHeight, clientWidth) {
    return this._isGridInViewPort(clientHeight, clientWidth, 0)
  }

  isGridInDrawArea(clientHeight, clientWidth) {
    return this._isGridInViewPort(clientHeight, clientWidth, clientHeight)
  }

  _isGridInViewPort(clientHeight, clientWidth, margin) {
    const { top, left } = this.element.getBoundingClientRect()
    const gridHeightIncludeDescendantGrids =
      getGridHeightIncludeDescendantGrids(this)
    const gridBottom = top - gridHeightIncludeDescendantGrids + this.gridHeight
    const gridTop = top - gridHeightIncludeDescendantGrids

    return (
      0 - margin <= gridBottom &&
      gridTop <= clientHeight + margin &&
      left <= clientWidth
    )
  }
}
