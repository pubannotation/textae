import getAnnotationBox from '../../getAnnotationBox'
import SELECTED from '../SELECTED'
import SpanInstance from '../SpanInstance'
import renderBackground from './renderBackground'
import setPosition from './setPosition'

// Leave a gap between the text and the block border.
const gapBetweenText = 8
export default class BlockSpanInstance extends SpanInstance {
  #textBox

  /**
   *
   * @param {import('../../createTextBox/TextBox').default} textBox
   */
  constructor(
    editorID,
    editorHTMLElement,
    begin,
    end,
    spanInstanceContainer,
    textBox
  ) {
    super(editorID, editorHTMLElement, begin, end, spanInstanceContainer)
    this.#textBox = textBox
  }

  // Utility to distinguish with other type spans.
  get isBlock() {
    return true
  }

  passesAllEntitiesTo(newSpan) {
    for (const entity of this.entities) {
      entity.span = newSpan
    }
  }

  select() {
    super.select()

    const el = super.element
    el.classList.add(SELECTED)

    this.#backgroundElement.classList.add(SELECTED)

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

    if (this.#backgroundElement) {
      this.#backgroundElement.classList.remove(SELECTED)
    }
  }

  updateBackgroundPosition() {
    if (this.isGridRendered) {
      const height = this.#height

      const clientRect = this.element.getBoundingClientRect()
      const offsetLeft =
        clientRect.left - this.#textBox.boundingClientRect.left - gapBetweenText
      const width = clientRect.width + gapBetweenText

      setPosition(
        this.#backgroundElement,
        this.#offsetTop,
        offsetLeft,
        width,
        height
      )

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
    renderBackground(annotationBox, this.#backgroundID)
  }

  destroyElement() {
    super.destroyElement()
    this.#backgroundElement.remove()
  }

  get heightIncludeDescendantGrids() {
    return super.gridHeight + 35
  }

  get widthOfGrid() {
    return 100
  }

  get offsetCenterOfGrid() {
    return this.#textBox.boundingClientRect.width - 58
  }

  get offsetTopOfGrid() {
    return this.#offsetTop
  }

  get clientBottomOfGrid() {
    return this.#clientTop + this.#height
  }

  get offsetBottomOfGrid() {
    return this.#offsetTop + this.#height
  }

  get offsetLeftOfGrid() {
    return this.#textBox.boundingClientRect.width - 108
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
    return this.#isGridInViewPort(clientHeight, 0)
  }

  isGridInDrawArea(clientHeight) {
    return this.#isGridInViewPort(clientHeight, clientHeight)
  }

  get #height() {
    return this.element.getBoundingClientRect().height
  }

  get #offsetTop() {
    return this.#clientTop - this.#textBox.boundingClientRect.top
  }

  get #backgroundID() {
    return `bg_of_${this.id}`
  }

  get #backgroundElement() {
    return document.querySelector(`#${this.#backgroundID}`)
  }

  #isGridInViewPort(clientHeight, margin) {
    return (
      0 - margin <= this.#clientBottom &&
      this.#clientTop <= clientHeight + margin
    )
  }

  // Shifting up half a line from the original block position.
  get #clientTop() {
    return this.#shiftUpGrid(this.element.getBoundingClientRect().top)
  }

  get #clientBottom() {
    return this.#shiftUpGrid(this.element.getBoundingClientRect().bottom)
  }

  #shiftUpGrid(y) {
    return y - this.#textBox.lineHeight / 2 + 20
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
