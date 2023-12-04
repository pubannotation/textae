import CompositeCommand from './CompositeCommand'
import ChangeAnnotationCommand from './ChangeAnnotationCommand'

export default class ChangeTypeOfSelectedItemsCommand extends CompositeCommand {
  constructor(annotationModel, selectionModel, annotationType, typeName) {
    super()

    const itemsWithChange = selectionModel[annotationType].all.filter(
      (item) => !item.typeValues.isSameType(typeName)
    )

    this._subCommands = itemsWithChange.map(
      (item) =>
        new ChangeAnnotationCommand(
          annotationModel,
          annotationType,
          item.id,
          typeName
        )
    )
    this._logMessage = `set type ${typeName} to ${annotationType} items ${itemsWithChange}`
  }
}
