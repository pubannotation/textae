import { RemoveCommand } from './commandTemplate'
import RelationAndAssociatesRemoveCommand from './RelationAndAssociatesRemoveCommand'
import CompositeCommand from './CompositeCommand'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, id) {
    super()
    const entityRemoveCommand = (entity) =>
      new RemoveCommand(
        editor,
        annotationData,
        selectionModel,
        'entity',
        entity
      )
    const removeEntity = entityRemoveCommand(id)
    const removeRelation = annotationData.entity
      .assosicatedRelations(id)
      .map(
        (id) =>
          new RelationAndAssociatesRemoveCommand(
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

    this.subCommands = removeRelation
      .concat(removeModification)
      .concat(removeEntity)
    this.id = id
  }

  execute() {
    super.execute('entity', 'remove', this.id, this.subCommands)
  }
}
