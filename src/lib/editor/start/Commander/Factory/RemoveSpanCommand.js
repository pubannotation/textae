import { RemoveCommand } from './commandTemplate'
import RemoveEntityAndAssociatesCommand from './RemoveEntityAndAssociatesCommand'
import CompositeCommand from './CompositeCommand'

export default class RemoveSpanCommand extends CompositeCommand {
  constructor(editor, annotationData, id) {
    super()

    const removeEntities = annotationData.span
      .get(id)
      .entities.map(
        ({ id }) =>
          new RemoveEntityAndAssociatesCommand(editor, annotationData, id)
      )

    const removeSpan = new RemoveCommand(editor, annotationData, 'span', id)

    this._subCommands = removeEntities.concat(removeSpan)
    this._logMessage = `remove a span ${id}`
  }
}
