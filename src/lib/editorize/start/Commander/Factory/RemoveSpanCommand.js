import { RemoveCommand } from './commandTemplate'
import RemoveEntityAndAssociatesCommand from './RemoveEntityAndAssociatesCommand'
import CompositeCommand from './CompositeCommand'

export default class RemoveSpanCommand extends CompositeCommand {
  constructor(editor, annotationData, id) {
    super()

    const span = annotationData.span.get(id)
    const removeEntities = span.entities.map(
      (entity) => new RemoveEntityAndAssociatesCommand(annotationData, entity)
    )

    const removeSpan = new RemoveCommand(annotationData, 'span', span)

    this._subCommands = removeEntities.concat(removeSpan)
    this._logMessage = `remove a span ${id}`
  }
}
