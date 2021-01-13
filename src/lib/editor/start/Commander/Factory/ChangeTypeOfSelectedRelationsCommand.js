import CompositeCommand from './CompositeCommand'
import ChangeAnnotationCommand from './ChangeAnnotationCommand'
import getChangeAttributeCommands from './ChangeTypeNameAndAttributeOfSelectedEntitiesCommand/getChangeAttributeCommands'

export default class ChangeTypeOfSelectedRelationsCommand extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, typeName) {
    super()

    const annotationType = 'relation'

    const elementsWithChange = selectionModel[annotationType].all.filter(
      (e) => !e.isSameType(typeName)
    )

    // Change type of entities.
    const changeTypeCommands = elementsWithChange.map(
      (e) =>
        new ChangeAnnotationCommand(
          editor,
          annotationData,
          annotationType,
          e.id,
          typeName
        )
    )

    // Change attributes
    const changeAttributeCommnads = getChangeAttributeCommands(
      elementsWithChange,
      [],
      annotationData,
      editor,
      selectionModel
    )

    this._subCommands = changeTypeCommands.concat(changeAttributeCommnads)
    this._logMessage = `set type ${typeName} to ${annotationType} items ${elementsWithChange}`
  }
}
