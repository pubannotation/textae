import dohtml from 'dohtml'
import SignboardHTMLElement from '../../../../SignboardHTMLElement'

export default class Label {
  constructor(container, relation, onClick, onMouseEnter, onMouseLeave) {
    this._container = container
    this._location = dohtml.create(
      `<div class="textae-editor__relation__signboard-location"></div>`
    )
    this._signboard = new SignboardHTMLElement(relation, 'relation', null)

    this._location.appendChild(this._signboard.element)
    this._location.addEventListener('click', onClick)
    this._location.addEventListener('mouseenter', onMouseEnter)
    this._location.addEventListener('mouseleave', onMouseLeave)

    this._container.appendChild(this._location)
  }

  updateAppearanceState(x, y, width, relation, isHovered) {
    this._updatePosition(this._location, x, y, width, relation)
    this._signboard.updateCSSClass(
      relation.isSelected
        ? 'textae-editor__signboard--selected'
        : isHovered
        ? 'textae-editor__signboard--hovered'
        : null
    )
  }

  updateValue(x, y, width, relation) {
    this._updatePosition(this._location, x, y, width, relation)
    this._signboard.updateLabel()
  }

  updatePosition(x, y, width, relation) {
    this._updatePosition(this._location, x, y, width, relation)
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

  _updatePosition(location, x, y, width, relation) {
    location.style.width = `${width}px`
    location.style.top = `${y - 18 - relation.attributes.length * 18}px`
    location.style.left = `${x}px`
  }
}