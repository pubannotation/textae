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
        ? 'ui-selected'
        : isHovered
        ? 'textae-editor__signboard--hover'
        : null,
      null
    )
    location.appendChild(signboard)
    container.appendChild(location)

    signboard.addEventListener('click', onClick)
    signboard.addEventListener('mouseenter', onMouseEnter)
    signboard.addEventListener('mouseleave', onMouseLeave)
    this._label = location
  }

  destructor() {
    this._container.removeChild(this._label)
  }

  get y() {
    return this._background.getBBox().y
  }

  get width() {
    return this._label.getBBox().width
  }

  get height() {
    return this._label.getBBox().height
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
