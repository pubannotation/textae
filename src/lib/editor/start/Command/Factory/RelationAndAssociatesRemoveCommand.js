import { RemoveCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, id) {
    super()
    const removeRelation = new RemoveCommand(
      editor,
      annotationData,
      selectionModel,
      'relation',
      id
    )
    const removeModification = annotationData
      .getModificationOf(id)
      .map((modification) => modification.id)
      .map(
        (id) =>
          new RemoveCommand(
            editor,
            annotationData,
            selectionModel,
            'modification',
            id
          )
      )
    this.subCommands = removeModification.concat(removeRelation)
    this._logMessage = `remove a relation ${id}`
  }
}
