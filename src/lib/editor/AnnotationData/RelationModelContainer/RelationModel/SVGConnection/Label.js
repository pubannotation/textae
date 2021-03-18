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

    const grid = document.createElement('div')

    grid.classList.add('textae-editor__relation__signboard-location')
    grid.style.top = `${y - 18}px`
    grid.style.left = `${x}px`

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
    grid.appendChild(entity)
    container.appendChild(grid)

    entity.addEventListener('click', onClick)
    this._label = grid
  }

  destructor() {
    this._container.removeChild(this._label)
  }
}
