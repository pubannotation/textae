import updatePath from './updatePath'
import createSourceBollard from './createSourceBollard'
import createTargetBollard from './createTargetBollard'
import createPath from './createPath'
import { NS } from '../NS'
import createJetty from './createJetty'
import moveJetty from './moveJetty'
import CurveAlgorithmFactory from './CurveAlgorithmFactory'

export default class Arrow {
  #container
  #relation
  #controlBarHeight
  #sourceBollard
  #targetBollard
  #path
  #pathAura
  #sourceBollardAura
  #targetBollardAura
  #sourceJetty
  #targetJetty
  #curveAlgorithm

  constructor(
    editorHTMLElement,
    relation,
    controlBarHeight,
    onAuraClick,
    onBollardClick,
    onMouseEnter,
    onMouseLeave
  ) {
    this.#container = editorHTMLElement.querySelector(
      '.textae-editor__relation-box'
    )
    this.#relation = relation
    this.#controlBarHeight = controlBarHeight

    const sourceBollard = createSourceBollard()
    this.#container.appendChild(sourceBollard)
    this.#sourceBollard = sourceBollard

    const targetBollard = createTargetBollard()
    this.#container.appendChild(targetBollard)
    this.#targetBollard = targetBollard

    const path = createPath()
    this.#container.appendChild(path)
    this.#path = path

    const pathAura = document.createElementNS(NS.SVG, 'path')
    pathAura.classList.add('textae-editor__relation-aura')
    pathAura.addEventListener('click', onAuraClick)
    pathAura.addEventListener('mouseenter', onMouseEnter)
    pathAura.addEventListener('mouseleave', onMouseLeave)
    const title = document.createElementNS(NS.SVG, 'title')
    pathAura.appendChild(title)
    this.#container.appendChild(pathAura)
    this.#pathAura = pathAura

    const sourceBollardAura = createSourceBollard()
    sourceBollardAura.classList.add('textae-editor__relation-bollard-aura')
    sourceBollardAura.addEventListener('click', (e) =>
      onBollardClick(e, relation.sourceEntity)
    )
    sourceBollardAura.appendChild(document.createElementNS(NS.SVG, 'title'))
    this.#container.appendChild(sourceBollardAura)
    this.#sourceBollardAura = sourceBollardAura

    const targetBollardAura = createTargetBollard()
    targetBollardAura.classList.add('textae-editor__relation-bollard-aura')
    targetBollardAura.addEventListener('click', (e) =>
      onBollardClick(e, relation.targetEntity)
    )
    targetBollardAura.appendChild(document.createElementNS(NS.SVG, 'title'))
    this.#container.appendChild(targetBollardAura)
    this.#targetBollardAura = targetBollardAura

    this.#sourceJetty = null
    this.#targetJetty = null

    this.update(false, false, false)
  }

  update(pointUpPath, pointUpSourceBollards, pointUpTargetBollards) {
    const curveAlgorithm = CurveAlgorithmFactory.create(
      this.#relation,
      pointUpSourceBollards,
      pointUpTargetBollards,
      this.#container.getBoundingClientRect().top,
      this.#controlBarHeight
    )
    updatePath(this.#path, curveAlgorithm, this.#relation.color, pointUpPath)
    updatePath(this.#pathAura, curveAlgorithm, this.#relation.color, false)
    this.#pathAura.children[0].textContent = this.#relation.title

    this.#sourceBollard.setAttribute(
      'style',
      `fill:${this.#relation.sourceColor}`
    )
    this.#sourceBollard.setAttribute(
      'transform',
      curveAlgorithm.transformDefinitionsForSourceTriangle
    )

    this.#targetBollard.setAttribute(
      'style',
      `fill:${this.#relation.targetColor}`
    )
    this.#targetBollard.setAttribute(
      'transform',
      curveAlgorithm.transformDefinitionsForTargetTriangle
    )

    this.#sourceBollardAura.children[0].textContent =
      this.#relation.sourceEntity.title
    this.#sourceBollardAura.setAttribute(
      'transform',
      curveAlgorithm.transformDefinitionsForSourceTriangle
    )

    this.#targetBollardAura.children[0].textContent =
      this.#relation.targetEntity.title
    this.#targetBollardAura.setAttribute(
      'transform',
      curveAlgorithm.transformDefinitionsForTargetTriangle
    )

    if (pointUpSourceBollards && curveAlgorithm.isSourceJettyVisible) {
      this.#drawSourceJetty(curveAlgorithm)
    } else {
      this.#destroySourceJetty()
    }

    if (pointUpTargetBollards && curveAlgorithm.isTargetJettyVisible) {
      this.#drawTargetJetty(curveAlgorithm)
    } else {
      this.#destroyTargetJetty()
    }

    this.#curveAlgorithm = curveAlgorithm
  }

  destructor() {
    this.#container.removeChild(this.#path)
    this.#container.removeChild(this.#sourceBollardAura)
    this.#container.removeChild(this.#targetBollardAura)
    this.#container.removeChild(this.#pathAura)
    this.#container.removeChild(this.#sourceBollard)
    this.#container.removeChild(this.#targetBollard)

    this.#destroySourceJetty()
    this.#destroyTargetJetty()
  }

  get top() {
    return this.#path.getBBox().y
  }

  get left() {
    return this.#path.getBBox().x
  }

  get highestX() {
    const _t = this.#curveAlgorithm.getTForY(this.top)

    return this.#curveAlgorithm.getXOnT(_t)
  }

  get width() {
    return this.#path.getBBox().width
  }

  #drawSourceJetty(curveAlgorithm) {
    const { sourceEntity } = this.#relation

    if (this.#sourceJetty) {
      moveJetty(
        this.#sourceJetty,
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
      this.#container.appendChild(sourceJetty)
      this.#sourceJetty = sourceJetty
    }
  }

  #drawTargetJetty(curveAlgorithm) {
    const { targetEntity } = this.#relation

    if (this.#targetJetty) {
      moveJetty(
        this.#targetJetty,
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
      this.#container.appendChild(targetJetty)
      this.#targetJetty = targetJetty
    }
  }

  #destroySourceJetty() {
    if (this.#sourceJetty) {
      this.#container.removeChild(this.#sourceJetty)
      this.#sourceJetty = null
    }
  }

  #destroyTargetJetty() {
    if (this.#targetJetty) {
      this.#container.removeChild(this.#targetJetty)
      this.#targetJetty = null
    }
  }
}
