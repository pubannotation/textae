import dohtml from 'dohtml'

import SignboardHTMLElement from '../../../SignboardHTMLElement'
import getAnnotationBox from '../../getAnnotationBox'

export default class Label {
  #container
  #relation
  #arrow
  #location
  #signboard
  #background

  /**
   *
   * @param {HTMLElement} editorHTMLElement
   * @param {import('.').default} relation
   * @param {import('./Arrow').default} arrow
   */
  constructor(
    editorHTMLElement,
    relation,
    arrow,
    onClick,
    onMouseEnter,
    onMouseLeave
  ) {
    this.#container = getAnnotationBox(editorHTMLElement)
    this.#relation = relation
    this.#arrow = arrow

    this.#location = dohtml.create(
      `<div class="textae-editor__relation__signboard-location"></div>`
    )
    this.#updatePosition()

    this.#signboard = new SignboardHTMLElement(relation, 'relation', null)
    this.#location.appendChild(this.#signboard.element)
    this.#container.appendChild(this.#location)

    this.#location.addEventListener('click', onClick)
    this.#location.addEventListener('mouseenter', onMouseEnter)
    this.#location.addEventListener('mouseleave', onMouseLeave)
  }

  updateValue() {
    this.#updatePosition()
    this.#signboard.updateLabel()
  }

  updateHighlighting() {
    this.#updatePosition()

    this.#signboard.clearCSSClass()

    if (this.#relation.isSelected) {
      this.#signboard.select()
    } else if (this.#relation.isHovered) {
      this.#signboard.hover()
    }
  }

  destructor() {
    this.#container.removeChild(this.#location)
  }

  get y() {
    return this.#background.getBBox().y
  }

  get width() {
    return this.#location.getBBox().width
  }

  get height() {
    return this.#location.getBBox().height
  }

  #updatePosition() {
    // Set the center of the label to the X coordinate of the highest point of the curve.
    this.#location.style.width = '0px'
    this.#location.style.left = `${this.#arrow.highestX}px`

    this.#location.style.top = `${
      this.#arrow.top - 18 - this.#relation.attributes.length * 18
    }px`
  }
}
