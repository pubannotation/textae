import { RemoveCommand } from './commandTemplate'
import EntityAndAssociatesRemoveCommand from './EntityAndAssociatesRemoveCommand'
import CompositeCommand from './CompositeCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, id) {
    super()
    const removeEntity = annotationData.span
      .get(id)
      .types.map((type) =>
        type.entities.map(
          (entity) =>
            new EntityAndAssociatesRemoveCommand(
              editor,
              annotationData,
              selectionModel,
              entity.id
            )
        )
      )
      .flat()
    const removeSpan = new RemoveCommand(
      editor,
      annotationData,
      selectionModel,
      'span',
      id
    )
    this._subCommands = removeEntity.concat(removeSpan)
    this._logMessage = `remove a span ${id}`
  }
}
