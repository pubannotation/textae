import CompositeCommand from './CompositeCommand'
import ChangeAnnotationCommand from './ChangeAnnotationCommand'

export default class ChangeTypeOfSelectedRelationsCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, typeName) {
    super()

    const annotationType = 'relation'

    const selectedElements = selectionModel[annotationType].all.filter(
      (e) => !e.isSameType(typeName)
    )

    this._subCommands = selectedElements.map(
      (e) =>
        new ChangeAnnotationCommand(
          editor,
          annotationData,
          annotationType,
          e.id,
          typeName
        )
    )
    this._logMessage = `set type ${typeName} to ${annotationType} items ${selectedElements}`
  }
}
