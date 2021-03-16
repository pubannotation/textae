import { v4 as uuidv4 } from 'uuid'
import createMarker from './createMarker'
import createPath from './createPath'
import setMarkerStyle from './setMarkerStyle'

export default class Arrow {
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

    const defs = container.children[0]
    this._head = this._createMarker(color, isBold, false, false)
    defs.appendChild(this._head)
    this._tail = this._createMarker(color, isBold, true, true)
    defs.appendChild(this._tail)
    this._downTail = this._createMarker(color, isBold, true, false)
    defs.appendChild(this._downTail)

    const path = createPath(
      sourceEndpoint,
      annotationBox,
      targetEndpoint,
      color,
      this._head,
      this._tail,
      this._downTail,
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
    defs.removeChild(this._head)
    defs.removeChild(this._tail)
    defs.removeChild(this._downTail)
  }

  get top() {
    const pathBBox = this._path.getBBox()
    return pathBBox.y
  }

  get left() {
    const pathBBox = this._path.getBBox()
    return pathBBox.x
  }

  get width() {
    const pathBBox = this._path.getBBox()
    return pathBBox.width
  }

  _createMarker(color, isBold, isTail, up) {
    // The ID of the SVG element is global scope in the Window.
    // If you don't make it unique, it will use another editor's arrow.
    const id = `r${uuidv4()}`
    const marker = createMarker(id, up)

    // Markers are affected by the stroke-width of the path.
    // If the path is made thicker, the marker will be larger than intended.
    //  When the path is made thicker, the marker should be smaller.
    const weights = isBold ? 0.5 : 1
    setMarkerStyle(marker, weights, color, isTail)

    return marker
  }
}
