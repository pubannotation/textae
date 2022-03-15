import updatePath from './updatePath'
import createSourceBollard from './createSourceBollard'
import createTargetBollard from './createTargetBollard'
import createPath from './createPath'
import { NS } from '../NS'
import createJetty from './createJetty'
import moveJetty from './moveJetty'
import CurveAlgorithmFactory from './CurveAlgorithmFactory'

export default class Arrow {
  constructor(
    editorHTMLElement,
    relation,
    controlBarHeight,
    onAuraClick,
    onBollardClick,
    onMouseEnter,
    onMouseLeave
  ) {
    this._container = editorHTMLElement.querySelector(
      '.textae-editor__relation-box'
    )
    this._relation = relation
    this._controlBarHeight = controlBarHeight

    const sourceBollard = createSourceBollard()
    sourceBollard.addEventListener('click', (e) =>
      onBollardClick(e, relation.sourceEntity)
    )
    sourceBollard.appendChild(document.createElementNS(NS.SVG, 'title'))
    this._container.appendChild(sourceBollard)
    this._sourceBollard = sourceBollard

    const targetBollard = createTargetBollard()
    targetBollard.addEventListener('click', (e) =>
      onBollardClick(e, relation.targetEntity)
    )
    targetBollard.appendChild(document.createElementNS(NS.SVG, 'title'))
    this._container.appendChild(targetBollard)
    this._targetBollard = targetBollard

    const path = createPath()
    this._container.appendChild(path)
    this._path = path

    const pathAura = document.createElementNS(NS.SVG, 'path')
    pathAura.classList.add('textae-editor__relation-aura')
    pathAura.addEventListener('click', onAuraClick)
    pathAura.addEventListener('mouseenter', onMouseEnter)
    pathAura.addEventListener('mouseleave', onMouseLeave)
    const title = document.createElementNS(NS.SVG, 'title')
    pathAura.appendChild(title)
    this._container.appendChild(pathAura)
    this._pathAura = pathAura
    this._sourceJetty = null
    this._targetJetty = null

    this.update(false, false, false)
  }

  update(pointUpPath, pointUpSourceBollards, pointUpTargetBollards) {
    const curveAlgorithm = CurveAlgorithmFactory.create(
      this._relation,
      pointUpSourceBollards,
      pointUpTargetBollards,
      this._container.getBoundingClientRect().top,
      this._controlBarHeight
    )
    updatePath(this._path, curveAlgorithm, this._relation.color, pointUpPath)
    updatePath(this._pathAura, curveAlgorithm, this._relation.color, false)
    this._pathAura.children[0].textContent = this._relation.title

    this._sourceBollard.setAttribute(
      'style',
      `fill:${this._relation.sourceColor}`
    )
    this._sourceBollard.setAttribute(
      'transform',
      curveAlgorithm.transformDefinitionsForSourceTriangle
    )
    this._sourceBollard.children[0].textContent =
      this._relation.sourceEntity.title

    this._targetBollard.setAttribute(
      'style',
      `fill:${this._relation.targetColor}`
    )
    this._targetBollard.setAttribute(
      'transform',
      curveAlgorithm.transformDefinitionsForTargetTriangle
    )
    this._targetBollard.children[0].textContent =
      this._relation.targetEntity.title

    if (pointUpSourceBollards && curveAlgorithm.isSourceJettyVisible) {
      this._drawSourceJetty(curveAlgorithm)
    } else {
      this._destroySourceJetty()
    }

    if (pointUpTargetBollards && curveAlgorithm.isTargetJettyVisible) {
      this._drawTargetJetty(curveAlgorithm)
    } else {
      this._destroyTargetJetty()
    }

    this._curveAlgorithm = curveAlgorithm
  }

  destructor() {
    this._container.removeChild(this._path)
    this._container.removeChild(this._pathAura)
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
    const _t = this._curveAlgorithm.getTForY(this.top)

    return this._curveAlgorithm.getXOnT(_t)
  }

  get width() {
    return this._path.getBBox().width
  }

  _drawSourceJetty(curveAlgorithm) {
    const { sourceEntity } = this._relation

    if (this._sourceJetty) {
      moveJetty(
        this._sourceJetty,
        curveAlgorithm.sourceX,
        curveAlgorithm.sourceY,
        sourceEntity
      )
    } else {
      const sourceJetty = createJetty(
        curveAlgorithm.sourceX,
        curveAlgorithm.sourceY,
        sourceEntity
      )
      this._container.appendChild(sourceJetty)
      this._sourceJetty = sourceJetty
    }
  }

  _drawTargetJetty(curveAlgorithm) {
    const { targetEntity } = this._relation

    if (this._targetJetty) {
      moveJetty(
        this._targetJetty,
        curveAlgorithm.targetX,
        curveAlgorithm.targetY,
        targetEntity
      )
    } else {
      const targetJetty = createJetty(
        curveAlgorithm.targetX,
        curveAlgorithm.targetY,
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
