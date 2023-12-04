import { RemoveCommand } from './commandTemplate'
import RemoveEntityAndAssociatesCommand from './RemoveEntityAndAssociatesCommand'
import CompositeCommand from './CompositeCommand'

export default class RemoveSpanCommand extends CompositeCommand {
  constructor(annotationModel, id) {
    super()

    const span = annotationModel.span.get(id)
    const removeEntities = span.entities.map(
      (entity) => new RemoveEntityAndAssociatesCommand(annotationModel, entity)
    )

    const removeSpan = new RemoveCommand(annotationModel, 'span', span)

    this._subCommands = removeEntities.concat(removeSpan)
    this._logMessage = `remove a span ${id}`
  }
}
