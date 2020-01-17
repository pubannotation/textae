import SpanRemoveCommand from '../SpanRemoveCommand'
import EntityAndAssociatesRemoveCommand from '../EntityAndAssociatesRemoveCommand'
import CompositeCommand from '../CompositeCommand'
import getSpans from './getSpans'
import removedEntitiesFromSpan from './removedEntitiesFromSpan'
import areAllEntiesOfSpanRemoved from './areAllEntiesOfSpanRemoved'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel) {
    super()
    const selectedEntities = selectionModel.entity.all
    const spans = getSpans(selectedEntities, annotationData)

    let commands = []
    for (const span of spans.values()) {
      // Remove span toggether when all entities of span will be removed.
      if (areAllEntiesOfSpanRemoved(span, selectedEntities)) {
        commands.push(
          new SpanRemoveCommand(editor, annotationData, selectionModel, span.id)
        )
      } else {
        commands = commands.concat(
          removedEntitiesFromSpan(selectedEntities, span).map(
            (entity) =>
              new EntityAndAssociatesRemoveCommand(
                editor,
                annotationData,
                selectionModel,
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
