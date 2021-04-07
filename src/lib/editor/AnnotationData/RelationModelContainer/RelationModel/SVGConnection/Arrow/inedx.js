import createPath from './createPath'
import createSourceTriangle from './createSourceTriangle'
import createTargetTriangle from './createTargetTriangle'
import createSourceLine from './createSourceLine'
import createTargetLine from './createTargetLine'

export default class Arrow {
  constructor(
    container,
    sourceEntity,
    targetEntity,
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

    const [path, pathPoints] = createPath(
      annotationBox,
      sourceEntity,
      targetEntity,
      pathColor,
      isBold
    )
    const { sourceX, sourceY, targetX, targetY } = pathPoints

    this._createSourceTriangle(sourceX, sourceY, sourceMarkerColor)
    this._createTargetTriangle(targetX, targetY, targetMarkerColor)

    this._lines = []
    if (isBold) {
      const sourceEndpoint = sourceEntity.typeValuesElement.getBoundingClientRect()
      const targetEndpoint = targetEntity.typeValuesElement.getBoundingClientRect()
      this._createSourceLine(sourceX, sourceY, sourceEndpoint, annotationBox)
      this._createTargetLine(targetX, targetY, targetEndpoint, annotationBox)
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
    this._container.removeChild(this._targetTriagle)

    for (const line of this._lines) {
      this._container.removeChild(line)
    }
    this._lines = []
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
    const sourceTriangle = createSourceTriangle(
      sourceX,
      sourceY,
      sourceMarkerColor
    )
    this._sourceTriagle = sourceTriangle
    this._container.appendChild(sourceTriangle)
  }

  _createTargetTriangle(targetX, targetY, targetMarkerColor) {
    const targetTriangle = createTargetTriangle(
      targetX,
      targetY,
      targetMarkerColor
    )
    this._targetTriagle = targetTriangle
    this._container.appendChild(targetTriangle)
  }

  _createSourceLine(sourceX, sourceY, sourceEndpoint, annotationBox) {
    const sourceLine = createSourceLine(
      sourceX,
      sourceY,
      sourceEndpoint,
      annotationBox
    )
    this._lines.push(sourceLine)
    this._container.appendChild(sourceLine)
  }

  _createTargetLine(targetX, targetY, targetEndpoint, annotationBox) {
    const targetLine = createTargetLine(
      targetX,
      targetY,
      targetEndpoint,
      annotationBox
    )
    this._lines.push(targetLine)
    this._container.appendChild(targetLine)
  }
}
