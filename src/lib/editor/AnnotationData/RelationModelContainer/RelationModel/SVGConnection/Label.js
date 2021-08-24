import SignboardHTMLElement from '../../../../SignboardHTMLElement'

export default class Label {
  constructor(
    container,
    x,
    y,
    width,
    relation,
    onClick,
    onMouseEnter,
    onMouseLeave
  ) {
    this._container = container

    const location = document.createElement('div')
    this._updatePosition(location, x, y, width, relation)

    this._signboard = new SignboardHTMLElement(relation, 'relation', null, null)
    location.appendChild(this._signboard.element)
    container.appendChild(location)

    location.addEventListener('click', onClick)
    location.addEventListener('mouseenter', onMouseEnter)
    location.addEventListener('mouseleave', onMouseLeave)
    this._location = location
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
    location.classList.add('textae-editor__relation__signboard-location')
    location.style.width = `${width}px`
    location.style.top = `${y - 18 - relation.attributes.length * 18}px`
    location.style.left = `${x}px`
  }
}
