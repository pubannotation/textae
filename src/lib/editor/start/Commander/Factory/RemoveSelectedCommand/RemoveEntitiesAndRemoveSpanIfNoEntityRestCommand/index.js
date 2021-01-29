import RemoveSpanCommand from '../../RemoveSpanCommand'
import RemoveEntityAndRemoveAssociatesCommand from '../../RemoveEntityAndAssociatesCommand'
import CompositeCommand from '../../CompositeCommand'
import getSpans from './getSpans'
import removedEntitiesFromSpan from './removedEntitiesFromSpan'
import areAllEntiesOfSpan from '../../areAllEntiesOfSpan'

export default class RemoveEntitiesAndRemoveSpanIfNoEntityRestCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel) {
    super()
    const selectedEntities = selectionModel.entity.all
    const spans = getSpans(selectedEntities)

    let commands = []
    for (const span of spans.values()) {
      // Remove span toggether when all entities of span will be removed.
      if (areAllEntiesOfSpan(span, selectedEntities)) {
        commands.push(
          new RemoveSpanCommand(editor, annotationData, selectionModel, span.id)
        )
      } else {
        commands = commands.concat(
          removedEntitiesFromSpan(selectedEntities, span).map(
            (entity) =>
              new RemoveEntityAndRemoveAssociatesCommand(
                editor,
                annotationData,
                entity.id
              )
          )
        )
      }
    }

    this._subCommands = commands
    this._logMessage = `remove entities ${selectedEntities.map(
      (entity) => entity.id
    )} from spans ${[...spans.values()].map((span) => span.id)}`
  }
}
