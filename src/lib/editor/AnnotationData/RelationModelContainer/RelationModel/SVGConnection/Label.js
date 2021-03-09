import { NS } from './NS'

export default class Label {
  constructor(container, x, y, displayName, href, color, onClick, isBold) {
    this._container = container

    const label = document.createElementNS(NS.SVG, 'text')
    label.textContent = displayName
    container.appendChild(label)
    const labelBBox = label.getBBox()
    label.setAttribute('x', x - labelBBox.width / 2)
    label.setAttribute('y', y)

    if (href) {
      label.classList.add('textae-editor__relation-label--isLink')
    }

    if (isBold) {
      label.classList.add('textae-editor__relation-label--isBold')
    }

    label.addEventListener('click', onClick)
    this._label = label

    const background = document.createElementNS(NS.SVG, 'rect')
    background.setAttribute('x', x - labelBBox.width / 2)
    background.setAttribute('y', y - labelBBox.height / 2 - 3)
    background.setAttribute('width', labelBBox.width)
    background.setAttribute('height', labelBBox.height)
    background.style.fill = color
    background.style.fillOpacity = 0.6
    container.insertBefore(background, label)
    this._background = background
  }

  destructor() {
    this._container.removeChild(this._label)
    this._container.removeChild(this._background)
  }
}
