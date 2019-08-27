import SpanRemoveCommand from '../SpanRemoveCommand'
import EntityAndAssociatesRemoveCommand from '../EntityAndAssociatesRemoveCommand'
import CompositeCommand from '../CompositeCommand'
import getSpans from './getSpans'
import removedEntitiesFromSpan from './removedEntitiesFromSpan'
import areAllEntiesOfSpanRemoved from './areAllEntiesOfSpanRemoved'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, entityIds) {
    super()
    const spans = getSpans(entityIds, annotationData)

    let commands = []
    for (const span of spans.values()) {
      // Remove span toggether when all entities of span will be removed.
      if (areAllEntiesOfSpanRemoved(span, entityIds)) {
        commands.push(
          new SpanRemoveCommand(editor, annotationData, selectionModel, span.id)
        )
      } else {
        commands = commands.concat(
          removedEntitiesFromSpan(entityIds, annotationData, span).map(
            (id) =>
              new EntityAndAssociatesRemoveCommand(
                editor,
                annotationData,
                selectionModel,
                id
              )
          )
        )
      }
    }

    this._subCommands = commands
    this._logMessage = `remove entities ${entityIds} from spans ${[
      ...spans.values()
    ].map((span) => span.id)}`
  }
}
