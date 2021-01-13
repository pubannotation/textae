import CompositeCommand from './CompositeCommand'
import ChangeAnnotationCommand from './ChangeAnnotationCommand'

export default class ChangeTypeOfSelectedRelationsCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, newType) {
    super()

    const selectedElements = selectionModel.relation.all
      .filter((relation) => !relation.isSameType(newType))
      .map((relation) => relation.id)

    this._subCommands = selectedElements.map(
      (id) =>
        new ChangeAnnotationCommand(
          editor,
          annotationData,
          'relation',
          id,
          newType
        )
    )
    this._logMessage = `set type ${newType} to relations ${selectedElements}`
  }
}
