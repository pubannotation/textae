import { MarkerHeight } from '../MarkerHeight'
import getControlXs from './getControlXs'
import getXPositions from './getXPositions'

export default class PathPoints {
  constructor(sourceEntity, targetEntity, isBold) {
    const { source: sourceX, target: targetX } = getXPositions(
      isBold,
      sourceEntity,
      targetEntity
    )
    const sourceY = sourceEntity.top - MarkerHeight - (isBold ? 3 : 0)
    const targetY = targetEntity.top - MarkerHeight - (isBold ? 3 : 0)

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
    if (this.targetControlX !== this.targetX) {
      const additionalControlY = this.sourceY * 0.3 + this.targetY * 0.7

      return `M ${this.sourceX}, ${this.sourceY} C ${this.sourceControlX} ${
        this.controlY
      }, ${this.targetControlX} ${this.controlY}, ${
        this.targetControlX * 0.25 + this.targetX * 0.75
      } ${this.controlY * 0.25 + additionalControlY * 0.75} Q ${
        this.targetX
      } ${additionalControlY}, ${this.targetX} ${this.targetY}`
    }

    if (this.sourceControlX !== this.sourceX) {
      const additionalControlY = this.sourceY * 0.7 + this.targetY * 0.3

      return `M ${this.sourceX}, ${this.sourceY} Q ${
        this.sourceX
      } ${additionalControlY}, ${
        this.sourceControlX * 0.25 + this.sourceX * 0.75
      } ${this.controlY * 0.25 + additionalControlY * 0.75} C ${
        this.sourceControlX
      } ${this.controlY}, ${this.targetControlX} ${this.controlY}, ${
        this.targetX
      } ${this.targetY}`
    }

    return `M ${this.sourceX}, ${this.sourceY} C ${this.sourceControlX} ${this.controlY}, ${this.targetControlX} ${this.controlY}, ${this.targetX} ${this.targetY}`
  }

  get transformDefinitionsForSourceTriangle() {
    return `translate(${this.sourceX}, ${this.sourceY})`
  }

  get transformDefinitionsForTargetTriangle() {
    return `translate(${this.targetX}, ${this.targetY})`
  }
}
