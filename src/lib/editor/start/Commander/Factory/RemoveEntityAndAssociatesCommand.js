import { RemoveCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'
import RemoveRelationAndAssociatesCommand from './RemoveRelationAndAssociatesCommand'

export default class RemoveEntityAndAssociatesCommand extends CompositeCommand {
  constructor(editor, annotationData, entity) {
    super()
    const removeEntity = new RemoveCommand(
      editor,
      annotationData,
      'entity',
      entity.id
    )
    const removeRelation = entity.relations.map(
      (relation) =>
        new RemoveRelationAndAssociatesCommand(editor, annotationData, relation)
    )
    const removeAttribute = entity.typeValues.attributes.map(
      (attribute) =>
        new RemoveCommand(editor, annotationData, 'attribute', attribute.id)
    )

    this._subCommands = removeRelation
      .concat(removeAttribute)
      .concat(removeEntity)
    this._logMessage = `remove an entity ${entity.id}`
  }
}
