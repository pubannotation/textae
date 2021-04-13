import { MarkerHeight } from '../MarkerHeight'
import getControlXs from './getControlXs'
import getXPositions from './getXPositions'

export default class PathPoints {
  constructor(annotationBox, sourceEntity, targetEntity, isBold) {
    const { source: sourceX, target: targetX } = getXPositions(
      isBold,
      sourceEntity,
      targetEntity,
      annotationBox
    )

    const sourceY =
      sourceEntity.typeValuesElement.getBoundingClientRect().top -
      annotationBox.top -
      MarkerHeight -
      (isBold ? 3 : 0)

    const targetY =
      targetEntity.typeValuesElement.getBoundingClientRect().top -
      annotationBox.top -
      MarkerHeight -
      (isBold ? 3 : 0)

    const { sourceControlX, targetControlX } = getControlXs(
      sourceX,
      sourceY,
      targetX,
      targetY
    )

    const controlY =
      Math.min(sourceY, targetY) -
      Math.abs(targetX - sourceX) / 2 -
      20 +
      (isBold ? 3 : 0)

    this.sourceY = sourceY
    this.targetY = targetY
    this.controlY = controlY
    this.sourceX = sourceX
    this.targetX = targetX
    this.sourceControlX = sourceControlX
    this.targetControlX = targetControlX
  }

  get pathCommands() {
    return `M ${this.sourceX}, ${this.sourceY} C ${this.sourceControlX} ${this.controlY}, ${this.targetControlX} ${this.controlY}, ${this.targetX} ${this.targetY}`
  }

  get transformDefinitionsForSourceTriangle() {
    return `translate(${this.sourceX}, ${this.sourceY})`
  }

  get transformDefinitionsForTargetTriangle() {
    return `translate(${this.targetX}, ${this.targetY})`
  }
}
