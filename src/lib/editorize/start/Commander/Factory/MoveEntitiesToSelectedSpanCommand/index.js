import CompositeCommand from '../CompositeCommand'
import areAllEntiesOfSpan from '../areAllEntiesOfSpan'
import { RemoveCommand } from '../commandTemplate'
import MoveEntitiesToSpanCommand from './MoveEntitiesToSpanCommand'

export default class MoveEntitiesToSelectedSpanCommand extends CompositeCommand {
  constructor(annotationData, selectionModel, entities) {
    console.assert(
      selectionModel.span.single,
      'There must be one span to be pasted.'
    )

    super()

    // Move cut entities to the selected span.
    const commands = [
      new MoveEntitiesToSpanCommand(
        annotationData,
        selectionModel.span.single,
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
      if (areAllEntiesOfSpan(span, entities)) {
        commands.push(new RemoveCommand(annotationData, 'span', span))
      }
    }

    this._subCommands = commands

    this._logMessage = `paste cut entities`
  }
}
