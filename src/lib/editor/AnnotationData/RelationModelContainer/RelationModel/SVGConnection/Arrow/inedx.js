import { v4 as uuidv4 } from 'uuid'
import createMarker from './createMarker'
import createPath from './createPath'
import setMarkerStyle from './setMarkerStyle'
import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'

export default class Arrow {
  constructor(
    container,
    sourceEndpoint,
    targetEndpoint,
    annotationBox,
    pathColor,
    sourceMarkerColor,
    targetMarkerColor,
    onClick,
    onMouseEnter,
    onMouseLeave,
    isBold
  ) {
    this._container = container

    const defs = container.children[0]
    this._targetMarker = this._createMarker(targetMarkerColor, isBold, false)
    defs.appendChild(this._targetMarker)

    const [path, pathPoints] = createPath(
      sourceEndpoint,
      annotationBox,
      targetEndpoint,
      pathColor,
      this._targetMarker,
      isBold
    )

    const sourceTriangle = document.createElementNS(NS.SVG, 'polygon')
    sourceTriangle.setAttribute('points', `0 0, ${MarkerHeight} 6, 0 12`)
    sourceTriangle.setAttribute('stroke', 'rgb(100, 100, 215)')
    sourceTriangle.setAttribute('fill', `${sourceMarkerColor}`)
    const { sourceX, sourceY } = pathPoints
    sourceTriangle.setAttribute(
      'transform',
      `translate(${sourceX - 6}, ${sourceY + MarkerHeight}) rotate(-90)`
    )
    this._sourceTriagle = sourceTriangle
    this._container.appendChild(sourceTriangle)

    if (isBold) {
      const { sourceX, sourceY } = pathPoints
      const sourceLine = this._createSourceLine(
        sourceX,
        sourceY,
        sourceEndpoint,
        annotationBox
      )
      container.appendChild(sourceLine)

      const { targetX, targetY } = pathPoints
      const targetLine = this._createTargetLine(
        targetX,
        targetY,
        targetEndpoint,
        annotationBox
      )
      container.appendChild(targetLine)

      this._lines = [sourceLine, targetLine]
    }

    container.appendChild(path)
    path.addEventListener('click', onClick)
    path.addEventListener('mouseenter', onMouseEnter)
    path.addEventListener('mouseleave', onMouseLeave)

    this._path = path
    this._pathPoints = pathPoints
  }

  destructor() {
    this._container.removeChild(this._path)
    this._container.removeChild(this._sourceTriagle)
    const defs = this._container.children[0]
    defs.removeChild(this._targetMarker)

    if (this._lines) {
      for (const line of this._lines) {
        this._container.removeChild(line)
      }
      this._lines = null
    }
  }

  get top() {
    const pathBBox = this._path.getBBox()
    return pathBBox.y
  }

  get left() {
    if (this._t) {
      const { sourceX, targetX, targetContlorX } = this._pathPoints
      const labelX =
        Math.pow(1 - this._t, 3) * sourceX +
        3 * Math.pow(1 - this._t, 2) * this._t * sourceX +
        3 * (1 - this._t) * Math.pow(this._t, 2) * targetContlorX +
        Math.pow(this._t, 3) * targetX
      return labelX
    }

    const pathBBox = this._path.getBBox()
    return pathBBox.x
  }

  get width() {
    if (this._t) {
      return 0
    }

    const pathBBox = this._path.getBBox()
    return pathBBox.width
  }

  get _t() {
    const { sourceY, targetY, controleY } = this._pathPoints
    // https://ja.javascript.info/bezier-curve
    // (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
    const sample = 20
    return [...Array(sample).keys()]
      .map((i) => (i * 1) / sample)
      .find((t) => {
        const labelY =
          Math.pow(1 - t, 3) * sourceY +
          3 * Math.pow(1 - t, 2) * t * controleY +
          3 * (1 - t) * Math.pow(t, 2) * controleY +
          Math.pow(t, 3) * targetY
        return Math.abs(labelY - this._path.getBBox().y) < 1
      })
  }

  _createMarker(color, isBold, isTail) {
    // The ID of the SVG element is global scope in the Window.
    // If you don't make it unique, it will use another editor's arrow.
    const id = `r${uuidv4()}`
    const marker = createMarker(id, !isTail)

    // Markers are affected by the stroke-width of the path.
    // If the path is made thicker, the marker will be larger than intended.
    //  When the path is made thicker, the marker should be smaller.
    const weights = isBold ? 0.5 : 1
    setMarkerStyle(marker, weights, color, isTail)

    return marker
  }

  _createSourceLine(sourceX, sourceY, sourceEndpoint, annotationBox) {
    const sourceLine = document.createElementNS(NS.SVG, 'polyline')
    const centerOfSource =
      sourceEndpoint.left + sourceEndpoint.width / 2 - annotationBox.left
    sourceLine.setAttribute(
      'points',
      `${sourceX} ${sourceY + MarkerHeight}, ${centerOfSource} ${
        sourceY + MarkerHeight
      }, ${centerOfSource} ${sourceEndpoint.top - annotationBox.top}`
    )
    sourceLine.setAttribute('style', 'stroke:rgb(100, 100, 215); fill: none;')

    return sourceLine
  }

  _createTargetLine(targetX, targetY, targetEndpoint, annotationBox) {
    const targetLine = document.createElementNS(NS.SVG, 'polyline')
    const centerOfTarget =
      targetEndpoint.left + targetEndpoint.width / 2 - annotationBox.left
    targetLine.setAttribute(
      'points',
      `${targetX} ${targetY + MarkerHeight}, ${centerOfTarget} ${
        targetY + MarkerHeight
      }, ${centerOfTarget} ${targetEndpoint.top - annotationBox.top}`
    )
    targetLine.setAttribute('style', 'stroke:rgb(100, 100, 215); fill: none;')

    return targetLine
  }
}
