import CompositeCommand from '../CompositeCommand'
import { RemoveCommand } from '../commandTemplate'
import areAllEntitiesOfSpan from './areAllEntitiesOfSpan'
import MoveEntitiesToSpanCommand from './MoveEntitiesToSpanCommand'

export default class MoveEntitiesToSelectedDenotationSpanCommand extends CompositeCommand {
  constructor(annotationModel, selectionModel, entities) {
    console.assert(
      selectionModel.span.single,
      'There must be one span to be pasted.'
    )

    super()

    // Move cut entities to the selected span.
    const commands = [
      new MoveEntitiesToSpanCommand(
        annotationModel,
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
      if (areAllEntitiesOfSpan(span, entities)) {
        commands.push(new RemoveCommand(annotationModel, 'span', span))
      }
    }

    this._subCommands = commands

    this._logMessage = `paste cut entities`
  }
}
