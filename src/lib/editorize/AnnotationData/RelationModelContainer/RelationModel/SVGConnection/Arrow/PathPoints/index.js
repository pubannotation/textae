import getControlXs from './getControlXs'
import getSourceAndTarget from './getSourceAndTarget'

export default class PathPoints {
  constructor(
    sourceEntity,
    targetEntity,
    alignSourceBollards,
    alignTargetBollards
  ) {
    const [source, target] = getSourceAndTarget(
      sourceEntity,
      targetEntity,
      alignSourceBollards,
      alignTargetBollards
    )

    const { sourceControlX, targetControlX } = getControlXs(
      source,
      target,
      sourceEntity.bottom,
      targetEntity.bottom
    )

    const controlY =
      Math.min(source.y, target.y) -
      Math.abs(target.x - source.x) / 4 -
      20 +
      (alignSourceBollards && alignTargetBollards ? 3 : 0)

    this.sourceY = source.y
    this.targetY = target.y
    this.controlY = controlY
    this.sourceX = source.x
    this.targetX = target.x
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
