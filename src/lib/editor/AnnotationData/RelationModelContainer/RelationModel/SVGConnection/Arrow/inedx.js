import updatePath from './updatePath'
import createSourceTriangle from './createSourceTriangle'
import createTargetTriangle from './createTargetTriangle'
import createSourceLine from './createSourceLine'
import createTargetLine from './createTargetLine'
import createPath from './createPath'
import PathPoints from './PathPoints'

export default class Arrow {
  constructor(container, onClick, onMouseEnter, onMouseLeave) {
    this._container = container

    const sourceTriangle = createSourceTriangle()
    this._container.appendChild(sourceTriangle)
    this._sourceTriangle = sourceTriangle

    const targetTriangle = createTargetTriangle()
    this._container.appendChild(targetTriangle)
    this._targetTriangle = targetTriangle

    const path = createPath()
    container.appendChild(path)
    path.addEventListener('click', onClick)
    path.addEventListener('mouseenter', onMouseEnter)
    path.addEventListener('mouseleave', onMouseLeave)
    this._path = path

    this._lines = []
  }

  update(
    annotationBox,
    sourceEntity,
    targetEntity,
    pathColor,
    sourceMarkerColor,
    targetMarkerColor,
    isBold
  ) {
    const pathPoints = new PathPoints(
      annotationBox,
      sourceEntity,
      targetEntity,
      isBold
    )
    updatePath(this._path, pathPoints, pathColor, isBold)

    this._sourceTriangle.setAttribute('style', `fill:${sourceMarkerColor}`)
    this._sourceTriangle.setAttribute(
      'transform',
      pathPoints.transformDefinitionsForSourceTriangle
    )

    this._targetTriangle.setAttribute('style', `fill:${targetMarkerColor}`)
    this._targetTriangle.setAttribute(
      'transform',
      pathPoints.transformDefinitionsForTargetTriangle
    )

    if (isBold) {
      const sourceEndpoint = sourceEntity.typeValuesElement.getBoundingClientRect()
      const targetEndpoint = targetEntity.typeValuesElement.getBoundingClientRect()
      this._createSourceLine(pathPoints, sourceEndpoint, annotationBox)
      this._createTargetLine(pathPoints, targetEndpoint, annotationBox)
    } else {
      for (const line of this._lines) {
        this._container.removeChild(line)
      }
      this._lines = []
    }

    this._pathPoints = pathPoints
  }

  destructor() {
    this._container.removeChild(this._path)
    this._container.removeChild(this._sourceTriangle)
    this._container.removeChild(this._targetTriangle)

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
      const {
        sourceX,
        targetX,
        sourceControlX,
        targetControlX
      } = this._pathPoints
      const labelX =
        Math.pow(1 - this._t, 3) * sourceX +
        3 * Math.pow(1 - this._t, 2) * this._t * sourceControlX +
        3 * (1 - this._t) * Math.pow(this._t, 2) * targetControlX +
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
    const { sourceY, targetY, controlY } = this._pathPoints
    // https://ja.javascript.info/bezier-curve
    // (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
    const sample = 20
    return [...Array(sample).keys()]
      .map((i) => (i * 1) / sample)
      .find((t) => {
        const labelY =
          Math.pow(1 - t, 3) * sourceY +
          3 * Math.pow(1 - t, 2) * t * controlY +
          3 * (1 - t) * Math.pow(t, 2) * controlY +
          Math.pow(t, 3) * targetY
        return Math.abs(labelY - this._path.getBBox().y) < 1
      })
  }

  _createSourceLine(pathPoints, sourceEndpoint, annotationBox) {
    const sourceLine = createSourceLine(
      pathPoints,
      sourceEndpoint,
      annotationBox
    )
    this._lines.push(sourceLine)
    this._container.appendChild(sourceLine)
  }

  _createTargetLine(pathPoints, targetEndpoint, annotationBox) {
    const targetLine = createTargetLine(
      pathPoints,
      targetEndpoint,
      annotationBox
    )
    this._lines.push(targetLine)
    this._container.appendChild(targetLine)
  }
}
