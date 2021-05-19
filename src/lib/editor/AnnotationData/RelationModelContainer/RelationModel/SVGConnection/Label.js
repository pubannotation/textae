import createSignboardHTMLElement from '../../../../createSignboardHTMLElement'

export default class Label {
  constructor(
    container,
    x,
    y,
    width,
    relation,
    onClick,
    onMouseEnter,
    onMouseLeave,
    isSelected,
    isHovered
  ) {
    this._container = container

    const location = document.createElement('div')
    this._updatePosition(location, x, y, width, relation)

    const signboard = createSignboardHTMLElement(
      relation,
      'relation',
      isSelected
        ? 'textae-editor__signboard--selected'
        : isHovered
        ? 'textae-editor__signboard--hover'
        : null,
      null
    )
    location.appendChild(signboard)
    container.appendChild(location)

    location.addEventListener('click', onClick)
    location.addEventListener('mouseenter', onMouseEnter)
    location.addEventListener('mouseleave', onMouseLeave)
    this._location = location
  }

  redraw(x, y, width, relation, isSelected, isHovered) {
    this._updatePosition(this._location, x, y, width, relation)
    this._location.replaceChild(
      createSignboardHTMLElement(
        relation,
        'relation',
        isSelected
          ? 'textae-editor__signboard--selected'
          : isHovered
          ? 'textae-editor__signboard--hover'
          : null,
        null
      ),
      this._location.firstChild
    )
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
    location.style.top = `${
      y - 18 - relation.typeValues.attributes.length * 18
    }px`
    location.style.left = `${x}px`
  }
}
