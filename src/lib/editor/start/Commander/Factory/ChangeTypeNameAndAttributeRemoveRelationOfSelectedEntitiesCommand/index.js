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
    newType,
    newAttributes,
    typeContainer
  ) {
    super()

    // Get only entities with changes.
    const entitiesWithChange = selectionModel.entity
      .all()
      .filter(
        (entityId) =>
          !annotationData.entity.get(entityId).sameType(newType, newAttributes)
      )

    // Change type of entities.
    const changeTypeCommands = entitiesWithChange.map(
      (id) =>
        new ChangeTypeCommand(editor, annotationData, 'entity', id, newType)
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
    const removeRelationCommands = typeContainer.isBlock(newType)
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
    this._logMessage = `set type ${newType} and ${JSON.stringify(
      newAttributes
    )} to entities ${entitiesWithChange}`
  }
}
