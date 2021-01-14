import CompositeCommand from './CompositeCommand'
import ChangeAnnotationCommand from './ChangeAnnotationCommand'

export default class ChangeTypeOfSelectedRelationsCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    annotationType,
    typeName
  ) {
    super()

    const elementsWithChange = selectionModel[annotationType].all.filter(
      (e) => !e.isSameType(typeName)
    )

    this._subCommands = elementsWithChange.map(
      (e) =>
        new ChangeAnnotationCommand(
          editor,
          annotationData,
          annotationType,
          e.id,
          typeName
        )
    )
    this._logMessage = `set type ${typeName} to ${annotationType} items ${elementsWithChange}`
  }
}
