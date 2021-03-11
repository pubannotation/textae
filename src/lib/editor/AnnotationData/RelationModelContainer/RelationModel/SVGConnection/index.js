import { v4 as uuidv4 } from 'uuid'
import createMarker from './createMarker'
import createPath from './createPath'
import Label from './Label'
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
    const annotationBox = this._editor[0]
      .querySelector('.textae-editor__annotation-box')
      .getBoundingClientRect()
    const sourceEndpoint = this._relation.sourceEndpoint.getBoundingClientRect()
    const targetEndpoint = this._relation.targetEndpoint.getBoundingClientRect()

    this._arrow = new Arrow(
      this._relationBox,
      sourceEndpoint,
      targetEndpoint,
      annotationBox,
      this._relation.color,
      this._onClick,
      () => this.pointUp(),
      () => this.pointDown(),
      isBold
    )
  }

  _createLabel(isBold) {
    const labelX = this._arrow.center
    const labelY = this._arrow.top - 2

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
    this._arrow.destructor()
    this._label.destructor()
  }
}
class Arrow {
  constructor(
    container,
    sourceEndpoint,
    targetEndpoint,
    annotationBox,
    color,
    onClick,
    onMouseEnter,
    onMouseLeave,
    isBold
  ) {
    this._container = container

    this._marker = this._createMarker(color, isBold)
    const defs = container.children[0]
    defs.appendChild(this._marker)

    const path = createPath(
      sourceEndpoint,
      annotationBox,
      targetEndpoint,
      color,
      this._marker,
      isBold
    )
    container.appendChild(path)
    path.addEventListener('click', onClick)
    path.addEventListener('mouseenter', onMouseEnter)
    path.addEventListener('mouseleave', onMouseLeave)
    this._path = path
  }

  destructor() {
    this._container.removeChild(this._path)
    const defs = this._container.children[0]
    defs.removeChild(this._marker)
  }

  get top() {
    const pathBBox = this._path.getBBox()
    return pathBBox.y
  }

  get center() {
    const pathBBox = this._path.getBBox()
    return pathBBox.x + pathBBox.width / 2
  }

  _createMarker(color, isBold) {
    // The ID of the SVG element is global scope in the Window.
    // If you don't make it unique, it will use another editor's arrow.
    const id = `r${uuidv4()}`
    const marker = createMarker(id)

    // Markers are affected by the stroke-width of the path.
    // If the path is made thicker, the marker will be larger than intended.
    //  When the path is made thicker, the marker should be smaller.
    const weights = isBold ? 0.5 : 1
    setMarkerStyle(marker, weights, color)

    return marker
  }
}
