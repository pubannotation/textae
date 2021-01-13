import CompositeCommand from './CompositeCommand'
import ChangeAnnotationCommand from './ChangeAnnotationCommand'

export default class ChangeTypeOfSelectedRelationsCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, newType) {
    super()

    const selectedElements = selectionModel.relation.all.filter(
      (e) => !e.isSameType(newType)
    )

    this._subCommands = selectedElements.map(
      (e) =>
        new ChangeAnnotationCommand(
          editor,
          annotationData,
          'relation',
          e.id,
          newType
        )
    )
    this._logMessage = `set type ${newType} to relations ${selectedElements}`
  }
}
