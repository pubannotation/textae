import { RemoveCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'
import RemoveEntityAndAssociatesCommand from './RemoveEntityAndAssociatesCommand'

export default class RemoveSpanCommand extends CompositeCommand {
  constructor(annotationModel, id) {
    super()

    const span = annotationModel.getSpan(id)
    const removeEntities = span.entities.map(
      (entity) => new RemoveEntityAndAssociatesCommand(annotationModel, entity)
    )

    const removeSpan = new RemoveCommand(annotationModel, 'span', span)

    this._subCommands = removeEntities.concat(removeSpan)
    this._logMessage = `remove a span ${id}`
  }
}
