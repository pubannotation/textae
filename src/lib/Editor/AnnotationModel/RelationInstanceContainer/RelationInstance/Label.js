import dohtml from 'dohtml'
import SignboardHTMLElement from '../../../SignboardHTMLElement'
import getAnnotationBox from '../../getAnnotationBox'

export default class Label {
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
    this._container = getAnnotationBox(editorHTMLElement)
    this._relation = relation
    this._arrow = arrow

    this._location = dohtml.create(
      `<div class="textae-editor__relation__signboard-location"></div>`
    )
    this._updatePosition()

    this._signboard = new SignboardHTMLElement(relation, 'relation', null)
    this._location.appendChild(this._signboard.element)
    this._container.appendChild(this._location)

    this._location.addEventListener('click', onClick)
    this._location.addEventListener('mouseenter', onMouseEnter)
    this._location.addEventListener('mouseleave', onMouseLeave)
  }

  updateValue() {
    this._updatePosition()
    this._signboard.updateLabel()
  }

  updateHighlighting() {
    this._updatePosition()

    this._signboard.clearCSSClass()

    if (this._relation.isSelected) {
      this._signboard.select()
    } else if (this._relation.isHovered) {
      this._signboard.hover()
    }
  }

  destructor() {
    this._container.removeChild(this._location)
  }

  get y() {
    return this._background.getBBox().y
  }

  get width() {
    return this._location.getBBox().width
  }

  get height() {
    return this._location.getBBox().height
  }

  _updatePosition() {
    // Set the center of the label to the X coordinate of the highest point of the curve.
    this._location.style.width = '0px'
    this._location.style.left = `${this._arrow.highestX}px`

    this._location.style.top = `${
      this._arrow.top - 18 - this._relation.attributes.length * 18
    }px`
  }
}
