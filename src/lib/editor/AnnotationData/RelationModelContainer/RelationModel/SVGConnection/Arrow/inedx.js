import updatePath from './updatePath'
import createSourceBollard from './createSourceBollard'
import createTargetBollard from './createTargetBollard'
import createPath from './createPath'
import PathPoints from './PathPoints'
import { NS } from '../NS'
import createJetty from './createJetty'

export default class Arrow {
  constructor(container, relation, onClick, onMouseEnter, onMouseLeave) {
    this._container = container
    this._relation = relation

    const sourceBollard = createSourceBollard()
    this._container.appendChild(sourceBollard)
    this._sourceBollard = sourceBollard

    const targetBollard = createTargetBollard()
    this._container.appendChild(targetBollard)
    this._targetBollard = targetBollard

    const path = createPath()
    container.appendChild(path)
    this._path = path

    const aura = document.createElementNS(NS.SVG, 'path')
    aura.classList.add('textae-editor__relation-aura')
    aura.addEventListener('click', onClick)
    aura.addEventListener('mouseenter', onMouseEnter)
    aura.addEventListener('mouseleave', onMouseLeave)
    const title = document.createElementNS(NS.SVG, 'title')
    aura.appendChild(title)
    container.appendChild(aura)
    this._aura = aura

    this._jetties = []
  }

  update(annotationBox, isBold) {
    const pathPoints = new PathPoints(
      this._relation.sourceEntity,
      this._relation.targetEntity,
      isBold
    )
    updatePath(this._path, pathPoints, this._relation.color, isBold)
    updatePath(this._aura, pathPoints, this._relation.color, false)
    this._aura.children[0].textContent = this._relation.title

    this._sourceBollard.setAttribute(
      'style',
      `fill:${this._relation.sourceColor}`
    )
    this._sourceBollard.setAttribute(
      'transform',
      pathPoints.transformDefinitionsForSourceTriangle
    )

    this._targetBollard.setAttribute(
      'style',
      `fill:${this._relation.targetColor}`
    )
    this._targetBollard.setAttribute(
      'transform',
      pathPoints.transformDefinitionsForTargetTriangle
    )

    if (isBold) {
      this._drawJetties(pathPoints)
    } else {
      this._destroyJetties()
    }

    this._pathPoints = pathPoints
  }

  destructor() {
    this._container.removeChild(this._path)
    this._container.removeChild(this._aura)
    this._container.removeChild(this._sourceBollard)
    this._container.removeChild(this._targetBollard)

    this._destroyJetties()
  }

  get top() {
    const pathBBox = this._path.getBBox()
    return pathBBox.y
  }

  get left() {
    if (this._t) {
      const { sourceX, targetX, sourceControlX, targetControlX } =
        this._pathPoints
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

  _drawJetties(pathPoints) {
    const { sourceEntity, targetEntity } = this._relation

    const sourceJetty = createJetty(
      pathPoints.sourceX,
      pathPoints.sourceY,
      sourceEntity
    )
    this._container.appendChild(sourceJetty)
    this._jetties.push(sourceJetty)

    const targetJetty = createJetty(
      pathPoints.targetX,
      pathPoints.targetY,
      targetEntity
    )
    this._container.appendChild(targetJetty)
    this._jetties.push(targetJetty)
  }

  _destroyJetties() {
    for (const node of this._jetties) {
      this._container.removeChild(node)
    }
    this._jetties = []
  }
}
