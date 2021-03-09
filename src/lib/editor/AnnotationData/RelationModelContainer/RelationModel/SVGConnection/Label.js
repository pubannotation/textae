import createSignboardHTMLElement from '../../../../EntityModel/createSignboardHTMLElement'

export default class Label {
  constructor(
    container,
    x,
    y,
    width,
    relationId,
    displayName,
    href,
    color,
    attributes,
    onClick,
    isSelected
  ) {
    this._container = container

    const location = document.createElement('div')

    location.classList.add('textae-editor__relation__signboard-location')
    location.style.width = `${width}px`
    location.style.top = `${y - 18}px`
    location.style.left = `${x}px`

    const signboard = createSignboardHTMLElement(
      relationId,
      'relation',
      color,
      href,
      displayName,
      attributes,
      isSelected ? 'ui-selected' : null,
      null
    )
    location.appendChild(signboard)
    container.appendChild(location)

    signboard.addEventListener('click', onClick)
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
}
