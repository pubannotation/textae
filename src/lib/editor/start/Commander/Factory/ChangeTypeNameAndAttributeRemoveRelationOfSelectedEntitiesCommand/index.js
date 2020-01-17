import CompositeCommand from '../CompositeCommand'
import ChangeTypeCommand from '../ChangeTypeCommand'
import getRemoveRelationCommands from '../getRemoveRelationCommands'
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
    const entitiesWithChange = selectionModel.entity.all
      .filter((entity) => !entity.sameType(newTypeName, newAttributes))
      .map((entity) => entity.id)

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

    // Block types do not have relations. If there is a relation, delete it.
    const removeRelationCommands = annotationData.entity.isBlock(newTypeName)
      ? getRemoveRelationCommands(
          entitiesWithChange,
          annotationData,
          editor,
          selectionModel
        )
      : []

    this._subCommands = removeRelationCommands
      .concat(changeTypeCommands)
      .concat(removeAttributeCommands)
      .concat(addAttributeCommands)
    this._logMessage = `set type ${newTypeName} and ${JSON.stringify(
      newAttributes
    )} to entities ${entitiesWithChange}`
  }
}
