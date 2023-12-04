import SELECTED from '../SELECTED'
import getGridHeightIncludeDescendantGrids from './getGridHeightIncludeDescendantGrids'
import round from '../../../round'
import SpanInstance from '../SpanInstance'
import isTouchable from '../../../isTouchable'
import { makeDenotationSpanHTMLElementID } from '../../../idFactory'

const TEXT_HEIGHT = 23
const MARGIN_TOP = 5
export default class DenotationSpanInstance extends SpanInstance {
  constructor(
    editorID,
    editorHTMLElement,
    begin,
    end,
    entityInstanceContainer,
    spanInstanceContainer
  ) {
    super(editorID, editorHTMLElement, begin, end, spanInstanceContainer)
    this._entityInstanceContainer = entityInstanceContainer
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
    return this._spanInstanceContainer.getStyle(this.id)
  }

  get _offsetLeft() {
    const spanElement = this.element

    // An element.offsetTop and element.offsetLeft does not work in the Firefox,
    // when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
    const rectOfSpan = spanElement.getBoundingClientRect()
    const rectOfTextBox =
      spanElement.offsetParent.offsetParent.getBoundingClientRect()

    const left = rectOfSpan.left - rectOfTextBox.left

    return left
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
    while (parentSpan instanceof DenotationSpanInstance) {
      parentSpan.updateGridPosition()
      parentSpan = parentSpan.parent
    }
  }

  updateDenotationEntitiesWidth() {
    if (this.isGridRendered) {
      const { widthOfGrid } = this
      this.gridElement.style.width = `${widthOfGrid}px`
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
    return this._gridHeightIncludeDescendantGrids + TEXT_HEIGHT + MARGIN_TOP
  }

  get widthOfGrid() {
    if (isTouchable) {
      const rectOfSpan = this.element.getBoundingClientRect()
      const rectOfTextBox =
        this.element.offsetParent.offsetParent.getBoundingClientRect()
      const left = rectOfSpan.left - rectOfTextBox.left

      // To fix the position of the toolbar, we use position: sticky.
      // On Android chrome, if an element is drawn at a position that is out of the device width,
      // the sticky position will be shifted upward by the width of the overhang.
      // To prevent this, the grid is not drawn outside the text box.
      const width = Math.min(rectOfSpan.width, rectOfTextBox.width - left)

      return round(width)
    } else {
      return round(this.element.getBoundingClientRect().width)
    }
  }

  get offsetCenterOfGrid() {
    return this._offsetLeft + this.widthOfGrid / 2
  }

  get clientTopOfGrid() {
    return (
      this.element.getBoundingClientRect().top -
      this._gridHeightIncludeDescendantGrids
    )
  }

  get offsetTopOfGrid() {
    // An element.offsetTop and element.offsetLeft does not work in the Firefox,
    // when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
    const offsetTop =
      this.element.getBoundingClientRect().top -
      this.element.offsetParent.offsetParent.getBoundingClientRect().top
    return offsetTop - this._gridHeightIncludeDescendantGrids
  }

  get offsetLeftOfGrid() {
    return this._offsetLeft
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
      this._gridHeightIncludeDescendantGrids
    const gridBottom = top - gridHeightIncludeDescendantGrids + this.gridHeight
    const gridTop = top - gridHeightIncludeDescendantGrids

    return (
      0 - margin <= gridBottom &&
      gridTop <= clientHeight + margin &&
      left <= clientWidth
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

  get _gridHeightIncludeDescendantGrids() {
    return getGridHeightIncludeDescendantGrids(this)
  }
}
