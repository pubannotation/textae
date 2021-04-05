import createPath from './createPath'
import { NS } from '../NS'
import { MarkerHeight } from './MarkerHeight'
import { BaseColorStroke } from './BaseColorStroke'
import createSourceTriangle from './createSourceTriangle'
import createTargetTriangle from './createTargetTriangle'

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

    const [path, { sourceX, sourceY, targetX, targetY }] = createPath(
      sourceEndpoint,
      annotationBox,
      targetEndpoint,
      pathColor,
      isBold
    )

    const sourceTriangle = this._createSourceTriangle(
      sourceX,
      sourceY,
      sourceMarkerColor
    )
    this._sourceTriagle = sourceTriangle
    this._container.appendChild(sourceTriangle)

    const targetTriangle = this._createTargetTriangle(
      targetX,
      targetY,
      targetMarkerColor
    )
    this._targetTriagle = targetTriangle
    this._container.appendChild(targetTriangle)

    if (isBold) {
      const sourceLine = this._createSourceLine(
        sourceX,
        sourceY,
        sourceEndpoint,
        annotationBox
      )
      container.appendChild(sourceLine)

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
    this._pathPoints = { sourceX, sourceY, targetX, targetY }
  }

  destructor() {
    this._container.removeChild(this._path)
    this._container.removeChild(this._sourceTriagle)
    this._container.removeChild(this._targetTriagle)

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

  _createSourceTriangle(sourceX, sourceY, sourceMarkerColor) {
    return createSourceTriangle(sourceX, sourceY, sourceMarkerColor)
  }

  _createTargetTriangle(targetX, targetY, targetMarkerColor) {
    return createTargetTriangle(targetX, targetY, targetMarkerColor)
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
    sourceLine.setAttribute('style', `${BaseColorStroke}; fill: none;`)

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
    targetLine.setAttribute('style', `${BaseColorStroke}; fill: none;`)

    return targetLine
  }
}
