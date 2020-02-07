import { RemoveCommand } from './commandTemplate'
import RemoveRelationAndAssociatesCommand from './RemoveRelationAndAssociatesCommand'
import CompositeCommand from './CompositeCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, id) {
    super()
    const removeEentityCommand = (entity) =>
      new RemoveCommand(
        editor,
        annotationData,
        selectionModel,
        'entity',
        entity
      )
    const removeEntity = removeEentityCommand(id)
    const removeRelation = annotationData.entity
      .get(id)
      .relations.map(
        (id) =>
          new RemoveRelationAndAssociatesCommand(
            editor,
            annotationData,
            selectionModel,
            id
          )
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
    const removeAttribute = annotationData.entity
      .get(id)
      .attributes.map(
        (attribute) =>
          new RemoveCommand(
            editor,
            annotationData,
            selectionModel,
            'attribute',
            attribute.id
          )
      )

    this._subCommands = removeRelation
      .concat(removeModification)
      .concat(removeAttribute)
      .concat(removeEntity)
    this._logMessage = `remove an entity ${id}`
  }
}
