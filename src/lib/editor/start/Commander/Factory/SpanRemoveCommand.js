import { RemoveCommand } from './commandTemplate'
import EntityAndAssociatesRemoveCommand from './EntityAndAssociatesRemoveCommand'
import CompositeCommand from './CompositeCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, id) {
    super()

    const removeEntities = annotationData.span
      .get(id)
      .entities.map(
        ({ id }) =>
          new EntityAndAssociatesRemoveCommand(
            editor,
            annotationData,
            selectionModel,
            id
          )
      )

    const removeSpan = new RemoveCommand(
      editor,
      annotationData,
      selectionModel,
      'span',
      id
    )

    this._subCommands = removeEntities.concat(removeSpan)
    this._logMessage = `remove a span ${id}`
  }
}
