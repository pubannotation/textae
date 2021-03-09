import createMarker from './createMarker'
import createPath from './createPath'
import { NS } from './NS'
import setMarkerStyle from './setMarkerStyle'

export default class SVGConnection {
  constructor(relation, namespace, definitionContainer, onClick, editor) {
    this._relation = relation
    this._namespace = namespace
    this._definitionContainer = definitionContainer
    this._onClick = onClick
    this._editor = editor
    this._relationBox = editor[0].querySelector('.textae-editor__relation-box')

    this._createPath(false)
    this._createLabel(false)
  }

  destroy() {
    this._destoryPath()
  }

  select() {
    if (!this._isSelected) {
      this._isSelected = true
      this.destroy()
      this._createPath(true)
      this._createLabel(true)
    }
  }

  deselect() {
    if (this._isSelected) {
      this._isSelected = false
      this.recreate()
    }
  }

  pointUp() {
    if (!this._isSelected && !this._isHovered) {
      this._isHovered = true

      this._destoryPath()
      this._createPath(true)
      this._createLabel(true)
    }
  }

  pointDown() {
    if (!this._isSelected && this._isHovered) {
      this._isHovered = false
      this.recreate()
    }
  }

  recreate() {
    this.destroy()
    if (this._isSelected) {
      this._createPath(true)
      this._createLabel(true)
    } else {
      this._createPath(false)
      this._createLabel(false)
    }
  }

  // Private APIs
  _createPath(isBold) {
    const marker = this._createMarker(isBold)

    const annotationBox = this._editor[0]
      .querySelector('.textae-editor__annotation-box')
      .getBoundingClientRect()
    const sourceEndpoint = this._relation.sourceEndpoint.getBoundingClientRect()
    const targetEndpoint = this._relation.targetEndpoint.getBoundingClientRect()

    const path = createPath(
      sourceEndpoint,
      annotationBox,
      targetEndpoint,
      this._relation.color,
      marker,
      isBold
    )

    this._relationBox.appendChild(path)

    path.addEventListener('click', this._onClick)
    path.addEventListener('mouseenter', () => this.pointUp())
    path.addEventListener('mouseleave', () => this.pointDown())
    this._path = path
  }

  _createMarker(isBold) {
    // The ID of the SVG element is global scope in the Window.
    // If you don't make it unique, it will use another editor's arrow.
    const id = `${this._editor.editorId}_${this._relation.id}`

    // Markers are affected by the stroke-width of the path.
    // If the path is made thicker, the marker will be larger than intended.
    //  When the path is made thicker, the marker should be smaller.
    const weights = isBold ? 0.5 : 1

    const defs = this._relationBox.children[0]
    if (!defs.querySelector(`#${id}`)) {
      const marker = createMarker(id)
      defs.appendChild(marker)
    }

    const marker = defs.querySelector(`#${id}`)
    setMarkerStyle(marker, weights, this._relation.color)
    return marker
  }

  _createLabel(isBold) {
    const pathBBox = this._path.getBBox()
    const labelX = pathBBox.x + pathBBox.width / 2
    const labelY = pathBBox.y - 2

    this._label = new Label(
      this._relationBox,
      labelX,
      labelY,
      `[${this._relation.id}] ${this._relation.displayName}`,
      this._relation.href,
      'yellow',
      this._onClick,
      isBold
    )
  }

  _destoryPath() {
    this._relationBox.removeChild(this._path)
    this._label.destructor()
  }
}

class Label {
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
