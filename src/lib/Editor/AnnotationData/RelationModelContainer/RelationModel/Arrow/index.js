import updatePath from './updatePath'
import createSourceBollard from './createSourceBollard'
import createTargetBollard from './createTargetBollard'
import createPath from './createPath'
import { NS } from '../NS'
import createJetty from './createJetty'
import moveJetty from './moveJetty'
import createPathPoints from './createPathPoints'

export default class Arrow {
  constructor(
    container,
    relation,
    controlBarHeight,
    onClick,
    onMouseEnter,
    onMouseLeave
  ) {
    this._container = container
    this._relation = relation
    this._controlBarHeight = controlBarHeight

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
    this._sourceJetty = null
    this._targetJetty = null

    this.update(false, false, false)
  }

  update(pointUpPath, pointUpSourceBollards, pointUpTargetBollards) {
    const pathPoints = createPathPoints(
      this._relation.sourceEntity,
      this._relation.targetEntity,
      pointUpSourceBollards,
      pointUpTargetBollards,
      this._container.getBoundingClientRect().top,
      this._controlBarHeight
    )
    updatePath(this._path, pathPoints, this._relation.color, pointUpPath)
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

    if (pointUpSourceBollards) {
      this._drawSourceJetty(pathPoints)
    } else {
      this._destroySourceJetty()
    }

    if (pointUpTargetBollards) {
      this._drawTargetJetty(pathPoints)
    } else {
      this._destroyTargetJetty()
    }

    this._pathPoints = pathPoints
  }

  destructor() {
    this._container.removeChild(this._path)
    this._container.removeChild(this._aura)
    this._container.removeChild(this._sourceBollard)
    this._container.removeChild(this._targetBollard)

    this._destroySourceJetty()
    this._destroyTargetJetty()
  }

  get top() {
    return this._path.getBBox().y
  }

  get left() {
    return this._path.getBBox().x
  }

  get highestX() {
    const _t = this._pathPoints.getTForY(this.top)

    return this._pathPoints.getXOnT(_t)
  }

  get width() {
    return this._path.getBBox().width
  }

  _drawSourceJetty(pathPoints) {
    const { sourceEntity } = this._relation

    if (this._sourceJetty) {
      moveJetty(
        this._sourceJetty,
        pathPoints.sourceX,
        pathPoints.sourceY,
        sourceEntity
      )
    } else {
      const sourceJetty = createJetty(
        pathPoints.sourceX,
        pathPoints.sourceY,
        sourceEntity
      )
      this._container.appendChild(sourceJetty)
      this._sourceJetty = sourceJetty
    }
  }

  _drawTargetJetty(pathPoints) {
    const { targetEntity } = this._relation

    if (this._targetJetty) {
      moveJetty(
        this._targetJetty,
        pathPoints.targetX,
        pathPoints.targetY,
        targetEntity
      )
    } else {
      const targetJetty = createJetty(
        pathPoints.targetX,
        pathPoints.targetY,
        targetEntity
      )
      this._container.appendChild(targetJetty)
      this._targetJetty = targetJetty
    }
  }

  _destroySourceJetty() {
    if (this._sourceJetty) {
      this._container.removeChild(this._sourceJetty)
      this._sourceJetty = null
    }
  }

  _destroyTargetJetty() {
    if (this._targetJetty) {
      this._container.removeChild(this._targetJetty)
      this._targetJetty = null
    }
  }
}
