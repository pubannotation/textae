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
    this.id = id
  }

  execute() {
    super.execute('relation', 'remove', this.id, this.subCommands)
  }
}
