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
    onClick
  ) {
    this._container = container

    const location = document.createElement('div')

    location.classList.add('textae-editor__relation__signboard-location')
    location.style.top = `${y - 18}px`
    location.style.left = `${x}px`

    const entity = createSignboardHTMLElement(
      relationId,
      'relation',
      color,
      href,
      displayName,
      [],
      null,
      null
    )
    location.appendChild(entity)
    container.appendChild(location)

    entity.addEventListener('click', onClick)
    this._label = location
  }

  destructor() {
    this._container.removeChild(this._label)
  }
}
