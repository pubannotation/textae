import CompositeCommand from '../CompositeCommand'
import areAllEntiesOfSpan from '../areAllEntiesOfSpan'
import { RemoveCommand } from '../commandTemplate'
import MoveEntitiesToSpanCommand from './MoveEntitiesToSpanCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, entities) {
    super()

    // Move cut entities to the selected span.
    const commands = [
      new MoveEntitiesToSpanCommand(
        annotationData,
        selectionModel.span.singleId,
        entities
      )
    ]

    // Remove spans losing all entities.
    for (const span of entities
      .map((entity) => entity.span)
      .reduce((acc, span) => {
        acc.add(span)
        return acc
      }, new Set())
      .values()) {
      const fromSpan = annotationData.span.get(span)
      if (areAllEntiesOfSpan(fromSpan, entities)) {
        commands.push(
          new RemoveCommand(
            editor,
            annotationData,
            selectionModel,
            'span',
            span
          )
        )
      }
    }

    this._subCommands = commands

    this._logMessage = `paste cut entities`
  }
}
