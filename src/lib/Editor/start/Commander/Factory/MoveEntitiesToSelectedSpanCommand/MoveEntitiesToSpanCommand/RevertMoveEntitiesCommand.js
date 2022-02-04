import CompositeCommand from '../../CompositeCommand'
import MoveEntitiesToSpanCommand from './index'

export default class RevertMoveEntitiesCommand extends CompositeCommand {
  constructor(annotationData, moveMap) {
    super()

    this._subCommands = []
    for (const [span, entities] of moveMap.entries()) {
      this._subCommands.push(
        new MoveEntitiesToSpanCommand(annotationData, span, entities)
      )
    }

    this._logMessage = `revert: move entities ${Array.from(moveMap.values())
      .flat()
      .map((e) => e.id)
      .join(', ')}`
  }
}
