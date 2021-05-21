import { RemoveCommand } from './commandTemplate'
import RemoveEntityAndAssociatesCommand from './RemoveEntityAndAssociatesCommand'
import CompositeCommand from './CompositeCommand'

export default class RemoveSpanCommand extends CompositeCommand {
  constructor(editor, annotationData, id) {
    super()

    const span = annotationData.span.get(id)
    const removeEntities = span.entities.map(
      (entity) =>
        new RemoveEntityAndAssociatesCommand(editor, annotationData, entity)
    )

    const removeSpan = new RemoveCommand(editor, annotationData, 'span', id)

    this._subCommands = removeEntities.concat(removeSpan)
    this._logMessage = `remove a span ${id}`
  }
}
