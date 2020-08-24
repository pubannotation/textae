import EntityModel from '../../../../EntityModel'
import CompositeCommand from '../CompositeCommand'
import ChangeTypeCommand from '../ChangeTypeCommand'
import getRemoveChangingAttributeCommands from './getRemoveChangingAttributeCommands'
import getAddChangingAttributeCommands from './getAddChangingAttributeCommands'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    newTypeName,
    newAttributes
  ) {
    super()

    // Get only entities with changes.
    const entitiesWithChange = EntityModel.rejectSameType(
      selectionModel.entity.all,
      newTypeName,
      newAttributes
    ).map((entity) => entity.id)

    // Change type of entities.
    const changeTypeCommands = entitiesWithChange.map(
      (id) =>
        new ChangeTypeCommand(editor, annotationData, 'entity', id, newTypeName)
    )

    // Delete all old attributes.
    const removeAttributeCommands = getRemoveChangingAttributeCommands(
      entitiesWithChange,
      annotationData,
      newAttributes,
      editor,
      selectionModel
    )

    // Add new attributes.
    const addAttributeCommands = getAddChangingAttributeCommands(
      entitiesWithChange,
      newAttributes,
      annotationData,
      editor,
      selectionModel
    )

    this._subCommands = changeTypeCommands
      .concat(removeAttributeCommands)
      .concat(addAttributeCommands)
    this._logMessage = `set type ${newTypeName} and ${JSON.stringify(
      newAttributes
    )} to entities ${entitiesWithChange}`
  }
}
